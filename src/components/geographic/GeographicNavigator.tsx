"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { nigeriaStates, type State, type LocalGovernment, type Ward, type Cooperative } from "@/data/nigeriaData"
import {
  MapPin,
  Building2,
  Users,
  ChevronRight,
  Search,
  Eye,
  Edit,
  ArrowLeft,
  Map,
  Globe,
  Navigation,
} from "lucide-react"

interface GeographicNavigatorProps {
  onCooperativeSelect?: (cooperative: Cooperative, location: { state: string; lga: string; ward: string }) => void
  showActions?: boolean
  allowSelection?: boolean
}

export const GeographicNavigator: React.FC<GeographicNavigatorProps> = ({
  onCooperativeSelect,
  showActions = true,
  allowSelection = false,
}) => {
  const [selectedState, setSelectedState] = useState<State | null>(null)
  const [selectedLGA, setSelectedLGA] = useState<LocalGovernment | null>(null)
  const [selectedWard, setSelectedWard] = useState<Ward | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState<"all" | "state" | "lga" | "ward" | "cooperative">("all")
  const [selectedCooperative, setSelectedCooperative] = useState<Cooperative | null>(null)

  // Statistics
  const [stats, setStats] = useState({
    totalStates: 0,
    totalLGAs: 0,
    totalWards: 0,
    totalCooperatives: 0,
    totalMembers: 0,
  })

  useEffect(() => {
    calculateStats()
  }, [])

  const calculateStats = () => {
    let totalLGAs = 0
    let totalWards = 0
    let totalCooperatives = 0
    let totalMembers = 0

    nigeriaStates.forEach((state) => {
      totalLGAs += state.localGovernments.length
      state.localGovernments.forEach((lga) => {
        totalWards += lga.wards.length
        lga.wards.forEach((ward) => {
          totalCooperatives += ward.cooperatives.length
          ward.cooperatives.forEach((coop) => {
            totalMembers += coop.memberCount
          })
        })
      })
    })

    setStats({
      totalStates: nigeriaStates.length,
      totalLGAs,
      totalWards,
      totalCooperatives,
      totalMembers,
    })
  }

  const resetNavigation = () => {
    setSelectedState(null)
    setSelectedLGA(null)
    setSelectedWard(null)
    setSelectedCooperative(null)
  }

  const handleCooperativeClick = (cooperative: Cooperative, state: State, lga: LocalGovernment, ward: Ward) => {
    if (allowSelection && onCooperativeSelect) {
      onCooperativeSelect(cooperative, {
        state: state.name,
        lga: lga.name,
        ward: ward.name,
      })
    } else {
      setSelectedCooperative(cooperative)
    }
  }

  const getFilteredStates = () => {
    if (!searchTerm) return nigeriaStates

    return nigeriaStates.filter((state) => {
      const stateMatch = state.name.toLowerCase().includes(searchTerm.toLowerCase())

      const lgaMatch = state.localGovernments.some((lga) => lga.name.toLowerCase().includes(searchTerm.toLowerCase()))

      const wardMatch = state.localGovernments.some((lga) =>
        lga.wards.some((ward) => ward.name.toLowerCase().includes(searchTerm.toLowerCase())),
      )

      const cooperativeMatch = state.localGovernments.some((lga) =>
        lga.wards.some((ward) =>
          ward.cooperatives.some((coop) => coop.name.toLowerCase().includes(searchTerm.toLowerCase())),
        ),
      )

      return stateMatch || lgaMatch || wardMatch || cooperativeMatch
    })
  }

  const getFilteredLGAs = () => {
    if (!selectedState) return []
    if (!searchTerm) return selectedState.localGovernments

    return selectedState.localGovernments.filter((lga) => {
      const lgaMatch = lga.name.toLowerCase().includes(searchTerm.toLowerCase())

      const wardMatch = lga.wards.some((ward) => ward.name.toLowerCase().includes(searchTerm.toLowerCase()))

      const cooperativeMatch = lga.wards.some((ward) =>
        ward.cooperatives.some((coop) => coop.name.toLowerCase().includes(searchTerm.toLowerCase())),
      )

      return lgaMatch || wardMatch || cooperativeMatch
    })
  }

  const getFilteredWards = () => {
    if (!selectedLGA) return []
    if (!searchTerm) return selectedLGA.wards

    return selectedLGA.wards.filter((ward) => {
      const wardMatch = ward.name.toLowerCase().includes(searchTerm.toLowerCase())

      const cooperativeMatch = ward.cooperatives.some((coop) =>
        coop.name.toLowerCase().includes(searchTerm.toLowerCase()),
      )

      return wardMatch || cooperativeMatch
    })
  }

  const getFilteredCooperatives = () => {
    if (!selectedWard) return []
    if (!searchTerm) return selectedWard.cooperatives

    return selectedWard.cooperatives.filter((coop) => coop.name.toLowerCase().includes(searchTerm.toLowerCase()))
  }

  const getBreadcrumb = () => {
    const breadcrumb = ["Nigeria"]
    if (selectedState) breadcrumb.push(selectedState.name)
    if (selectedLGA) breadcrumb.push(selectedLGA.name)
    if (selectedWard) breadcrumb.push(selectedWard.name)
    return breadcrumb
  }

  return (
    <div className="space-y-6">
      {/* Header with Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="bg-blue-100 p-2 rounded-lg">
              <Globe className="text-blue-600" size={20} />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">States</p>
              <p className="text-xl font-bold">{stats.totalStates}</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="bg-green-100 p-2 rounded-lg">
              <MapPin className="text-green-600" size={20} />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">LGAs</p>
              <p className="text-xl font-bold">{stats.totalLGAs}</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="bg-purple-100 p-2 rounded-lg">
              <Navigation className="text-purple-600" size={20} />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Wards</p>
              <p className="text-xl font-bold">{stats.totalWards}</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="bg-orange-100 p-2 rounded-lg">
              <Building2 className="text-orange-600" size={20} />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Cooperatives</p>
              <p className="text-xl font-bold">{stats.totalCooperatives}</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="bg-red-100 p-2 rounded-lg">
              <Users className="text-red-600" size={20} />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Members</p>
              <p className="text-xl font-bold">{stats.totalMembers.toLocaleString()}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Navigation Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Map size={16} />
            {getBreadcrumb().map((item, index) => (
              <div key={index} className="flex items-center gap-2">
                {index > 0 && <ChevronRight size={14} />}
                <span className={index === getBreadcrumb().length - 1 ? "text-foreground font-medium" : ""}>
                  {item}
                </span>
              </div>
            ))}
          </div>

          {/* Reset Button */}
          {(selectedState || selectedLGA || selectedWard) && (
            <Button variant="outline" size="sm" onClick={resetNavigation}>
              <ArrowLeft size={14} className="mr-1" />
              Reset
            </Button>
          )}
        </div>

        {/* Search and Filter */}
        <div className="flex gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={16} />
            <Input
              placeholder="Search states, LGAs, wards, or cooperatives..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-80"
            />
          </div>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value as any)}
            className="px-3 py-2 border border-input rounded-md bg-background"
          >
            <option value="all">All</option>
            <option value="state">States</option>
            <option value="lga">LGAs</option>
            <option value="ward">Wards</option>
            <option value="cooperative">Cooperatives</option>
          </select>
        </div>
      </div>

      {/* States View */}
      {!selectedState && (
        <div>
          <h2 className="text-xl font-semibold mb-4">Nigerian States ({getFilteredStates().length})</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {getFilteredStates().map((state) => {
              const stateLGAs = state.localGovernments.length
              const stateWards = state.localGovernments.reduce((sum, lga) => sum + lga.wards.length, 0)
              const stateCooperatives = state.localGovernments.reduce(
                (sum, lga) => sum + lga.wards.reduce((wardSum, ward) => wardSum + ward.cooperatives.length, 0),
                0,
              )

              return (
                <Card
                  key={state.id}
                  className="p-4 cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => setSelectedState(state)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Globe className="text-primary" size={20} />
                      <div>
                        <h3 className="font-medium">{state.name}</h3>
                        <div className="text-sm text-muted-foreground">
                          {stateLGAs} LGAs • {stateWards} Wards • {stateCooperatives} Cooperatives
                        </div>
                      </div>
                    </div>
                    <ChevronRight size={16} className="text-muted-foreground" />
                  </div>
                </Card>
              )
            })}
          </div>
        </div>
      )}

      {/* LGAs View */}
      {selectedState && !selectedLGA && (
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Button variant="ghost" size="sm" onClick={() => setSelectedState(null)}>
              ← Back to States
            </Button>
            <span className="text-muted-foreground">|</span>
            <h2 className="text-xl font-semibold">
              {selectedState.name} - Local Governments ({getFilteredLGAs().length})
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {getFilteredLGAs().map((lga) => {
              const lgaWards = lga.wards.length
              const lgaCooperatives = lga.wards.reduce((sum, ward) => sum + ward.cooperatives.length, 0)

              return (
                <Card
                  key={lga.id}
                  className="p-4 cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => setSelectedLGA(lga)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <MapPin className="text-primary" size={20} />
                      <div>
                        <h3 className="font-medium">{lga.name}</h3>
                        <div className="text-sm text-muted-foreground">
                          {lgaWards} Wards • {lgaCooperatives} Cooperatives
                        </div>
                      </div>
                    </div>
                    <ChevronRight size={16} className="text-muted-foreground" />
                  </div>
                </Card>
              )
            })}
          </div>
        </div>
      )}

      {/* Wards View */}
      {selectedLGA && !selectedWard && (
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Button variant="ghost" size="sm" onClick={() => setSelectedLGA(null)}>
              ← Back to {selectedState?.name}
            </Button>
            <span className="text-muted-foreground">|</span>
            <h2 className="text-xl font-semibold">
              {selectedLGA.name} - Wards ({getFilteredWards().length})
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {getFilteredWards().map((ward) => (
              <Card
                key={ward.id}
                className="p-4 cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => setSelectedWard(ward)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Navigation className="text-primary" size={20} />
                    <div>
                      <h3 className="font-medium">{ward.name}</h3>
                      <div className="text-sm text-muted-foreground">{ward.cooperatives.length} Cooperatives</div>
                    </div>
                  </div>
                  <ChevronRight size={16} className="text-muted-foreground" />
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Cooperatives View */}
      {selectedWard && (
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Button variant="ghost" size="sm" onClick={() => setSelectedWard(null)}>
              ← Back to {selectedLGA?.name}
            </Button>
            <span className="text-muted-foreground">|</span>
            <h2 className="text-xl font-semibold">
              {selectedWard.name} - Cooperatives ({getFilteredCooperatives().length})
            </h2>
          </div>
          <div className="space-y-4">
            {getFilteredCooperatives().map((cooperative) => (
              <Card key={cooperative.id} className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold">{cooperative.name}</h3>
                    <p className="text-muted-foreground">{cooperative.address}</p>
                    <div className="flex gap-4 mt-2 text-sm text-muted-foreground">
                      <span>Members: {cooperative.memberCount}</span>
                      <span>Est. {cooperative.establishedYear}</span>
                      <span>Reg: {cooperative.registrationNumber}</span>
                    </div>
                  </div>
                  {showActions && (
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleCooperativeClick(cooperative, selectedState!, selectedLGA!, selectedWard)}
                      >
                        <Eye size={14} className="mr-1" />
                        View
                      </Button>
                      <Button variant="outline" size="sm">
                        <Edit size={14} className="mr-1" />
                        Edit
                      </Button>
                    </div>
                  )}
                </div>

                <div className="border-t pt-4">
                  <h4 className="font-medium mb-3">Executive Committee</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-sm text-muted-foreground">Chairman:</span>
                      <p className="font-medium">{cooperative.executiveCommittee.chairman}</p>
                    </div>
                    <div>
                      <span className="text-sm text-muted-foreground">Secretary:</span>
                      <p className="font-medium">{cooperative.executiveCommittee.secretary}</p>
                    </div>
                    <div>
                      <span className="text-sm text-muted-foreground">Treasurer:</span>
                      <p className="font-medium">{cooperative.executiveCommittee.treasurer}</p>
                    </div>
                    {cooperative.executiveCommittee.publicRelationsOfficer && (
                      <div>
                        <span className="text-sm text-muted-foreground">PRO:</span>
                        <p className="font-medium">{cooperative.executiveCommittee.publicRelationsOfficer}</p>
                      </div>
                    )}
                  </div>

                  <div className="border-t pt-4 mt-4">
                    <h4 className="font-medium mb-3">Physical Agents</h4>
                    <div className="space-y-3">
                      {cooperative.agents.map((agent) => (
                        <div key={agent.id} className="p-3 bg-secondary/20 rounded-lg">
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="font-medium">{agent.name}</p>
                              <p className="text-sm text-muted-foreground">{agent.phone}</p>
                              <p className="text-sm text-muted-foreground">{agent.email}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-xs text-muted-foreground">Address:</p>
                              <p className="text-sm">{agent.address}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Cooperative Details Modal */}
      {selectedCooperative && (
        <Dialog open={!!selectedCooperative} onOpenChange={() => setSelectedCooperative(null)}>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>{selectedCooperative.name}</DialogTitle>
            </DialogHeader>
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-3">Basic Information</h3>
                  <div className="space-y-2">
                    <div>
                      <span className="text-sm text-muted-foreground">Name:</span>
                      <p className="font-medium">{selectedCooperative.name}</p>
                    </div>
                    <div>
                      <span className="text-sm text-muted-foreground">Address:</span>
                      <p>{selectedCooperative.address}</p>
                    </div>
                    <div>
                      <span className="text-sm text-muted-foreground">Registration Number:</span>
                      <p className="font-mono text-sm">{selectedCooperative.registrationNumber}</p>
                    </div>
                    <div>
                      <span className="text-sm text-muted-foreground">Established:</span>
                      <p>{selectedCooperative.establishedYear}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-3">Location</h3>
                  <div className="space-y-2">
                    <div>
                      <span className="text-sm text-muted-foreground">State:</span>
                      <p>{selectedState?.name}</p>
                    </div>
                    <div>
                      <span className="text-sm text-muted-foreground">LGA:</span>
                      <p>{selectedLGA?.name}</p>
                    </div>
                    <div>
                      <span className="text-sm text-muted-foreground">Ward:</span>
                      <p>{selectedWard?.name}</p>
                    </div>
                    <div>
                      <span className="text-sm text-muted-foreground">Members:</span>
                      <p>{selectedCooperative.memberCount.toLocaleString()}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-3">Executive Committee</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-sm text-muted-foreground">Chairman:</span>
                    <p className="font-medium">{selectedCooperative.executiveCommittee.chairman}</p>
                  </div>
                  <div>
                    <span className="text-sm text-muted-foreground">Secretary:</span>
                    <p className="font-medium">{selectedCooperative.executiveCommittee.secretary}</p>
                  </div>
                  <div>
                    <span className="text-sm text-muted-foreground">Treasurer:</span>
                    <p className="font-medium">{selectedCooperative.executiveCommittee.treasurer}</p>
                  </div>
                  {selectedCooperative.executiveCommittee.publicRelationsOfficer && (
                    <div>
                      <span className="text-sm text-muted-foreground">PRO:</span>
                      <p className="font-medium">{selectedCooperative.executiveCommittee.publicRelationsOfficer}</p>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-3">Physical Agents</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {selectedCooperative.agents.map((agent) => (
                    <div key={agent.id} className="p-4 border rounded-lg">
                      <p className="font-medium">{agent.name}</p>
                      <p className="text-sm text-muted-foreground">{agent.phone}</p>
                      <p className="text-sm text-muted-foreground">{agent.email}</p>
                      <p className="text-sm text-muted-foreground">{agent.address}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
