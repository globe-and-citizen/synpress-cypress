// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

// This contract is the first version of crypto payment goal for celebrity fanalyzer.
/**
 * @title CompetitionEscrow
 * @dev This contract handles escrow for competition purposes. It allows for funds to be deposited upon prompt creation
 * and released to the winner upon selection. The contract includes functionality to pause and unpause operations.
 */
contract CompetitionEscrow is Ownable(msg.sender), Pausable, ReentrancyGuard {
    using Strings for uint256;

    uint256 constant REFUND_LOCK_PERIOD = 45 days; // Static value for simplicity
    uint256 constant FANALYZER_FEE_PERCENTAGE = 1; // Celebrity Fanalyzer's cut (1%)

    struct EscrowData {
        address payable depositor; // Address of the user who deposited the funds
        address payable recipient; // Address of the recipient (winner of the competition)
        uint256 amount; // Amount of funds deposited
        uint256 createdAt; // Timestamp when the escrow was created
        bool isRefunded; // Flag indicating if the funds have been refunded
        bool isReleased; // Flag indicating if the funds have been released
    }

    mapping(uint256 => EscrowData) private escrows;
    uint256 private escrowIdCounter = 0;

    event Deposited(uint256 indexed escrowId, address indexed depositor, uint256 amount);
    event Released(uint256 indexed escrowId, address indexed recipient, uint256 amount);
    event Refunded(uint256 indexed escrowId, address indexed depositor, uint256 amount);
    event RecipientSet(uint256 indexed escrowId, address indexed recipient);
    event DisputeResolved(uint256 indexed escrowId, address depositor, address recipient, uint256 depositorAmount, uint256 recipientAmount);

    /**
     * @dev Deposits funds into the escrow and assigns a unique ID to the deposit.
     * This is used when a prompt is created and funds are added for the competition.
     */
    function deposit() external payable whenNotPaused {
        uint256 newEscrowId = ++escrowIdCounter;
        escrows[newEscrowId] = EscrowData({
            depositor: payable(msg.sender),
            recipient: payable(address(0)),
            amount: msg.value,
            createdAt: block.timestamp,
            isRefunded: false,
            isReleased: false
        });

        emit Deposited(newEscrowId, msg.sender, msg.value);
    }

    /**
     * @dev Allows the depositor to set the recipient of the escrow after the competition ends.
     * This should be called once the winner of the prompt competition is decided.
     * @param escrowId The ID of the escrow.
     * @param recipient The address of the recipient (winner).
     */
    function setRecipient(uint256 escrowId, address payable recipient) external whenNotPaused {
        EscrowData storage escrow = escrows[escrowId];
        require(msg.sender == escrow.depositor, "Only the depositor can set the recipient.");
        require(!escrow.isReleased, "Funds already released.");
        require(!escrow.isRefunded, "Funds have been refunded.");
        require(escrow.recipient == address(0), "Recipient already set.");
        require(recipient != address(0), "Recipient address cannot be zero address.");

        escrow.recipient = recipient;
        emit RecipientSet(escrowId, recipient);
    }

    /**
     * @dev Allows the recipient to release the funds.
     * @param escrowId The ID of the escrow.
     */
    function release(uint256 escrowId) external nonReentrant whenNotPaused {
        EscrowData storage escrow = escrows[escrowId];
        require(!escrow.isReleased, "Funds already released.");
        require(!escrow.isRefunded, "Funds have been refunded.");
        require(escrow.recipient != address(0), "Recipient not set.");
        require(escrow.recipient == msg.sender, "Only the recipient can release the funds.");

        // Calculate Fanalyzer's fee
        uint256 fanalyzerFee = (escrow.amount * FANALYZER_FEE_PERCENTAGE) / 100;
        uint256 recipientAmount = escrow.amount - fanalyzerFee;

        // Transfer to recipient and Fanalyzer
        (bool successRecipient, ) = escrow.recipient.call{value: recipientAmount}("");
        require(successRecipient, "Transfer to recipient failed.");

        (bool successFanalyzer, ) = owner().call{value: fanalyzerFee}("");
        require(successFanalyzer, "Transfer to Fanalyzer failed.");

        escrow.isReleased = true;

        emit Released(escrowId, escrow.recipient, recipientAmount);
    }

    /**
     * @dev Allows the depositor to refund the deposited funds back to themselves after the lockout period.
     * This can be used if the competition is cancelled or if no winner is selected within 45 days.
     * @param escrowId The ID of the escrow.
     */
    function refund(uint256 escrowId) external nonReentrant whenNotPaused {
        EscrowData storage escrow = escrows[escrowId];
        require(msg.sender == escrow.depositor, "Only the depositor can refund the funds.");
        require(!escrow.isReleased, "Funds already released.");
        require(!escrow.isRefunded, "Funds have been refunded.");
        require(block.timestamp >= escrow.createdAt + REFUND_LOCK_PERIOD, "Refund not available yet.");
        require(escrow.recipient == address(0), "Recipient has already been set.");

        (bool success, ) = escrow.depositor.call{value: escrow.amount}("");
        require(success, "Transfer failed.");
        escrow.isRefunded = true;

        emit Refunded(escrowId, escrow.depositor, escrow.amount);
    }

    /**
     * @dev Allows the contract owner to resolve disputes after the lockout period.
     * The owner can allocate funds between the depositor and the recipient based on an arbitrary percentage.
     * @param escrowId The ID of the escrow.
     * @param depositorPercentage The percentage of the funds that should go to the depositor.
     */
    function resolveDispute(uint256 escrowId, uint256 depositorPercentage) external onlyOwner nonReentrant whenNotPaused {
        require(depositorPercentage <= 100, "Depositor percentage must be between 0 and 100.");

        EscrowData storage escrow = escrows[escrowId];
        require(!escrow.isReleased, "Funds already released.");
        require(!escrow.isRefunded, "Funds have been refunded.");
        require(block.timestamp >= escrow.createdAt + REFUND_LOCK_PERIOD, "Dispute resolution not available yet.");

        uint256 depositorAmount = (escrow.amount * depositorPercentage) / 100;
        uint256 recipientAmount = escrow.amount - depositorAmount;

        // Transfer to depositor
        if (depositorAmount > 0) {
            (bool successDepositor, ) = escrow.depositor.call{value: depositorAmount}("");
            require(successDepositor, "Transfer to depositor failed.");
        }

        // Transfer to recipient
        if (recipientAmount > 0 && escrow.recipient != address(0)) {
            (bool successRecipient, ) = escrow.recipient.call{value: recipientAmount}("");
            require(successRecipient, "Transfer to recipient failed.");
        }

        escrow.isReleased = true;

        emit DisputeResolved(escrowId, escrow.depositor, escrow.recipient, depositorAmount, recipientAmount);
    }

    /**
     * @dev Pauses the contract, preventing certain actions from being performed.
     * This function can only be called by the contract owner.
     */
    function pause() external onlyOwner {
        _pause();
    }

    /**
     * @dev Unpauses the contract, allowing actions to be performed again.
     * This function can only be called by the contract owner.
     */
    function unpause() external onlyOwner {
        _unpause();
    }

    // Fallback function to receive MATIC payments
    receive() external payable {}
}