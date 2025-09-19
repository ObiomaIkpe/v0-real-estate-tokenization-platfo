"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { GovernanceProposal } from "@/lib/types/hedera"
import { Vote, Clock, Users } from "lucide-react"

interface ProposalCardProps {
  proposal: GovernanceProposal
  userTokens: number
  onVote: (proposalId: string, vote: "for" | "against" | "abstain") => void
  canVote: boolean
}

export function ProposalCard({ proposal, userTokens, onVote, canVote }: ProposalCardProps) {
  const totalVotes = proposal.votes.for + proposal.votes.against + proposal.votes.abstain
  const forPercentage = totalVotes > 0 ? (proposal.votes.for / totalVotes) * 100 : 0
  const againstPercentage = totalVotes > 0 ? (proposal.votes.against / totalVotes) * 100 : 0

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-[#d69e2e] text-white"
      case "passed":
        return "bg-green-600 text-white"
      case "rejected":
        return "bg-red-600 text-white"
      default:
        return "bg-gray-500 text-white"
    }
  }

  const timeLeft = Math.max(0, Math.ceil((proposal.endDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24)))

  return (
    <Card className="border-[#2d3748] bg-white">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-[#2d3748] text-lg">{proposal.title}</CardTitle>
          <Badge className={getStatusColor(proposal.status)}>{proposal.status.toUpperCase()}</Badge>
        </div>
        <div className="flex items-center gap-4 text-sm text-gray-600">
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            <span>{timeLeft} days left</span>
          </div>
          <div className="flex items-center gap-1">
            <Users className="h-4 w-4" />
            <span>{totalVotes} votes cast</span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-gray-700">{proposal.description}</p>

        {/* Voting Results */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>For ({proposal.votes.for} tokens)</span>
            <span>{forPercentage.toFixed(1)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="bg-green-500 h-2 rounded-full" style={{ width: `${forPercentage}%` }} />
          </div>

          <div className="flex justify-between text-sm">
            <span>Against ({proposal.votes.against} tokens)</span>
            <span>{againstPercentage.toFixed(1)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="bg-red-500 h-2 rounded-full" style={{ width: `${againstPercentage}%` }} />
          </div>
        </div>

        {/* Voting Buttons */}
        {canVote && proposal.status === "active" && (
          <div className="flex gap-2 pt-4">
            <Button
              onClick={() => onVote(proposal.id, "for")}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white"
            >
              <Vote className="h-4 w-4 mr-2" />
              Vote For
            </Button>
            <Button
              onClick={() => onVote(proposal.id, "against")}
              className="flex-1 bg-red-600 hover:bg-red-700 text-white"
            >
              <Vote className="h-4 w-4 mr-2" />
              Vote Against
            </Button>
            <Button
              onClick={() => onVote(proposal.id, "abstain")}
              variant="outline"
              className="flex-1 border-[#2d3748] text-[#2d3748] hover:bg-gray-50"
            >
              Abstain
            </Button>
          </div>
        )}

        {userTokens > 0 && (
          <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded">Your voting power: {userTokens} tokens</div>
        )}
      </CardContent>
    </Card>
  )
}
