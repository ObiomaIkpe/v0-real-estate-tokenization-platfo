import { hederaConsensusService } from "../hedera/hcs"
import type { GovernanceProposal } from "../types/hedera"

export class GovernanceSystem {
  // Create a new governance proposal
  async createProposal(
    propertyId: string,
    tokenId: string,
    topicId: string,
    title: string,
    description: string,
    proposerAccountId: string,
    votingDurationDays = 7,
  ): Promise<GovernanceProposal> {
    try {
      const proposalId = `prop_${propertyId}_${Date.now()}`
      const endDate = new Date()
      endDate.setDate(endDate.getDate() + votingDurationDays)

      const proposal: GovernanceProposal = {
        id: proposalId,
        propertyId,
        title,
        description,
        proposer: proposerAccountId,
        votingPower: 0, // Will be calculated based on token holdings
        votes: {
          for: 0,
          against: 0,
          abstain: 0,
        },
        status: "active",
        createdAt: new Date(),
        endDate,
      }

      // Log proposal creation to HCS
      await hederaConsensusService.submitAuditLog(topicId, {
        propertyId,
        action: "GOVERNANCE_PROPOSAL_CREATED",
        details: {
          proposalId,
          title,
          description,
          proposer: proposerAccountId,
          endDate: endDate.toISOString(),
        },
        timestamp: Date.now(),
      })

      return proposal
    } catch (error) {
      console.error("Error creating governance proposal:", error)
      throw new Error("Failed to create governance proposal")
    }
  }

  // Cast a vote on a proposal
  async castVote(
    proposal: GovernanceProposal,
    voterAccountId: string,
    tokenId: string,
    topicId: string,
    vote: "for" | "against" | "abstain",
    tokenHoldings: number,
  ): Promise<GovernanceProposal> {
    try {
      // Update vote counts based on token holdings (voting power)
      const updatedProposal = { ...proposal }
      updatedProposal.votes[vote] += tokenHoldings

      // Log vote to HCS for transparency
      await hederaConsensusService.submitAuditLog(topicId, {
        propertyId: proposal.propertyId,
        action: "GOVERNANCE_VOTE_CAST",
        details: {
          proposalId: proposal.id,
          voter: voterAccountId,
          vote,
          votingPower: tokenHoldings,
          timestamp: new Date().toISOString(),
        },
        timestamp: Date.now(),
      })

      return updatedProposal
    } catch (error) {
      console.error("Error casting vote:", error)
      throw new Error("Failed to cast vote")
    }
  }

  // Execute a passed proposal
  async executeProposal(proposal: GovernanceProposal, topicId: string): Promise<void> {
    try {
      if (proposal.status !== "passed") {
        throw new Error("Proposal must be passed to execute")
      }

      // Log proposal execution to HCS
      await hederaConsensusService.submitAuditLog(topicId, {
        propertyId: proposal.propertyId,
        action: "GOVERNANCE_PROPOSAL_EXECUTED",
        details: {
          proposalId: proposal.id,
          title: proposal.title,
          finalVotes: proposal.votes,
          executionDate: new Date().toISOString(),
        },
        timestamp: Date.now(),
      })

      // Here you would implement the actual proposal execution logic
      // This could involve property management changes, fee adjustments, etc.
    } catch (error) {
      console.error("Error executing proposal:", error)
      throw new Error("Failed to execute proposal")
    }
  }

  // Calculate proposal status based on votes
  calculateProposalStatus(
    proposal: GovernanceProposal,
    totalTokenSupply: number,
    quorumPercentage = 25,
    passingPercentage = 50,
  ): "active" | "passed" | "rejected" {
    const now = new Date()

    // Check if voting period has ended
    if (now > proposal.endDate) {
      const totalVotes = proposal.votes.for + proposal.votes.against + proposal.votes.abstain
      const quorumRequired = (totalTokenSupply * quorumPercentage) / 100

      // Check if quorum is met
      if (totalVotes >= quorumRequired) {
        const forPercentage = (proposal.votes.for / totalVotes) * 100
        return forPercentage >= passingPercentage ? "passed" : "rejected"
      } else {
        return "rejected" // Failed to meet quorum
      }
    }

    return "active"
  }
}

export const governanceSystem = new GovernanceSystem()
