"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { ProposalCard } from "@/components/governance/proposal-card"
import type { GovernanceProposal } from "@/lib/types/hedera"
import { Plus, Vote, TrendingUp, Users, DollarSign } from "lucide-react"

export default function GovernancePage() {
  const [proposals, setProposals] = useState<GovernanceProposal[]>([])
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [userTokens] = useState(150) // Mock user token holdings
  const [newProposal, setNewProposal] = useState({
    title: "",
    description: "",
    propertyId: "",
  })

  // Mock proposals data
  useEffect(() => {
    const mockProposals: GovernanceProposal[] = [
      {
        id: "prop_1",
        propertyId: "prop_miami_001",
        title: "Upgrade Property Management System",
        description:
          "Proposal to upgrade the property management system to include smart home features and automated maintenance scheduling. This will increase property value and rental income.",
        proposer: "0.0.123456",
        votingPower: 0,
        votes: { for: 1250, against: 300, abstain: 150 },
        status: "active",
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        endDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
      },
      {
        id: "prop_2",
        propertyId: "prop_miami_001",
        title: "Reduce Management Fees",
        description: "Proposal to reduce annual management fees from 2% to 1.5% to increase returns for token holders.",
        proposer: "0.0.789012",
        votingPower: 0,
        votes: { for: 2100, against: 800, abstain: 200 },
        status: "passed",
        createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
        endDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      },
    ]
    setProposals(mockProposals)
  }, [])

  const handleVote = (proposalId: string, vote: "for" | "against" | "abstain") => {
    setProposals((prev) =>
      prev.map((proposal) => {
        if (proposal.id === proposalId) {
          return {
            ...proposal,
            votes: {
              ...proposal.votes,
              [vote]: proposal.votes[vote] + userTokens,
            },
          }
        }
        return proposal
      }),
    )
  }

  const handleCreateProposal = () => {
    if (!newProposal.title || !newProposal.description) return

    const proposal: GovernanceProposal = {
      id: `prop_${Date.now()}`,
      propertyId: newProposal.propertyId || "prop_miami_001",
      title: newProposal.title,
      description: newProposal.description,
      proposer: "0.0.123456", // Mock user account
      votingPower: userTokens,
      votes: { for: 0, against: 0, abstain: 0 },
      status: "active",
      createdAt: new Date(),
      endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    }

    setProposals((prev) => [proposal, ...prev])
    setNewProposal({ title: "", description: "", propertyId: "" })
    setShowCreateForm(false)
  }

  const activeProposals = proposals.filter((p) => p.status === "active")
  const completedProposals = proposals.filter((p) => p.status !== "active")

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-[#2d3748] text-white p-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Image src="/favicon.ico" alt="REALiFi Logo" width={32} height={32} className="rounded" />
            <h1 className="text-2xl font-bold">REALiFi Governance</h1>
          </div>
          <Button onClick={() => setShowCreateForm(true)} className="bg-[#d69e2e] hover:bg-[#b7791f] text-white">
            <Plus className="h-4 w-4 mr-2" />
            Create Proposal
          </Button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-6">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="border-[#2d3748]">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Your Voting Power</p>
                  <p className="text-2xl font-bold text-[#2d3748]">{userTokens}</p>
                </div>
                <Vote className="h-8 w-8 text-[#d69e2e]" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-[#2d3748]">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Active Proposals</p>
                  <p className="text-2xl font-bold text-[#2d3748]">{activeProposals.length}</p>
                </div>
                <TrendingUp className="h-8 w-8 text-[#d69e2e]" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-[#2d3748]">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Proposals</p>
                  <p className="text-2xl font-bold text-[#2d3748]">{proposals.length}</p>
                </div>
                <Users className="h-8 w-8 text-[#d69e2e]" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-[#2d3748]">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Properties Governed</p>
                  <p className="text-2xl font-bold text-[#2d3748]">3</p>
                </div>
                <DollarSign className="h-8 w-8 text-[#d69e2e]" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Create Proposal Form */}
        {showCreateForm && (
          <Card className="mb-8 border-[#2d3748]">
            <CardHeader>
              <CardTitle className="text-[#2d3748]">Create New Proposal</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                placeholder="Proposal Title"
                value={newProposal.title}
                onChange={(e) => setNewProposal((prev) => ({ ...prev, title: e.target.value }))}
                className="border-gray-300 focus:border-[#d69e2e]"
              />
              <Textarea
                placeholder="Proposal Description"
                value={newProposal.description}
                onChange={(e) => setNewProposal((prev) => ({ ...prev, description: e.target.value }))}
                className="border-gray-300 focus:border-[#d69e2e] min-h-[100px]"
              />
              <div className="flex gap-2">
                <Button onClick={handleCreateProposal} className="bg-[#d69e2e] hover:bg-[#b7791f] text-white">
                  Create Proposal
                </Button>
                <Button
                  onClick={() => setShowCreateForm(false)}
                  variant="outline"
                  className="border-[#2d3748] text-[#2d3748] hover:bg-gray-50"
                >
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Active Proposals */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-[#2d3748] mb-4">Active Proposals</h2>
          {activeProposals.length > 0 ? (
            <div className="grid gap-6">
              {activeProposals.map((proposal) => (
                <ProposalCard
                  key={proposal.id}
                  proposal={proposal}
                  userTokens={userTokens}
                  onVote={handleVote}
                  canVote={true}
                />
              ))}
            </div>
          ) : (
            <Card className="border-[#2d3748]">
              <CardContent className="p-8 text-center">
                <p className="text-gray-600">No active proposals at the moment.</p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Completed Proposals */}
        <div>
          <h2 className="text-xl font-bold text-[#2d3748] mb-4">Completed Proposals</h2>
          {completedProposals.length > 0 ? (
            <div className="grid gap-6">
              {completedProposals.map((proposal) => (
                <ProposalCard
                  key={proposal.id}
                  proposal={proposal}
                  userTokens={userTokens}
                  onVote={handleVote}
                  canVote={false}
                />
              ))}
            </div>
          ) : (
            <Card className="border-[#2d3748]">
              <CardContent className="p-8 text-center">
                <p className="text-gray-600">No completed proposals yet.</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
