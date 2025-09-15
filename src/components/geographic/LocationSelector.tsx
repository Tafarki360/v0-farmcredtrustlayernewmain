"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { nigeriaStates, type State, type LocalGovernment, type Ward } from "@/data/nigeriaData"
import { MapPin, Search, Check, ChevronDown } from "lucide-react"

interface LocationSelectorProps {
  onLocationSelect: (location: { state: string; lga: string; ward: string }) => void
  initialLocation?: { state?: string; lga?: string; ward?: string }
  required?: boolean
  label?: string
}

export const LocationSelector: React.FC<LocationSelectorProps> = ({
  onLocationSelect,
  initialLocation,
  required = false,
  label = "Select Location",
}) => {
  const [selectedState, setSelectedState] = useState<State | null>(null)
  const [selectedLGA, setSelectedLGA] = useState<LocalGovernment | null>(null)
  const [selectedWard, setSelectedWard] = useState<Ward | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [isOpen, setIsOpen] = useState(false)
  const [step, setStep] = useState<"state" | "lga" | "ward">("state")

  useEffect(() => {
    if (initialLocation) {
      // Set initial values if provided
      if (initialLocation.state) {
        const state = nigeriaStates.find((s) => s.name === initialLocation.state)
        if (state) {
          setSelectedState(state)
          setStep("lga")

          if (initialLocation.lga) {
            const lga = state.localGovernments.find((l) => l.name === initialLocation.lga)
            if (lga) {
              setSelectedLGA(lga)
              setStep("ward")

              if (initialLocation.ward) {
                const ward = lga.wards.find((w) => w.name === initialLocation.ward)
                if (ward) {
                  setSelectedWard(ward)
                }
              }
            }
          }
        }
      }
    }
  }, [initialLocation])

  const handleStateSelect = (state: State) => {
    setSelectedState(state)
    setSelectedLGA(null)
    setSelectedWard(null)
    setStep("lga")
    setSearchTerm("")
  }

  const handleLGASelect = (lga: LocalGovernment) => {
    setSelectedLGA(lga)
    setSelectedWard(null)
    setStep("ward")
    setSearchTerm("")
  }

  const handleWardSelect = (ward: Ward) => {
    setSelectedWard(ward)
    setSearchTerm("")

    // Call the callback with the complete location
    onLocationSelect({
      state: selectedState!.name,
      lga: selectedLGA!.name,
      ward: ward.name,
    })

    setIsOpen(false)
  }

  const resetSelection = () => {
    setSelectedState(null)
    setSelectedLGA(null)
    setSelectedWard(null)
    setStep("state")
    setSearchTerm("")
  }

  const getFilteredStates = () => {
    if (!searchTerm) return nigeriaStates
    return nigeriaStates.filter((state) => state.name.toLowerCase().includes(searchTerm.toLowerCase()))
  }

  const getFilteredLGAs = () => {
    if (!selectedState) return []
    if (!searchTerm) return selectedState.localGovernments
    return selectedState.localGovernments.filter((lga) => lga.name.toLowerCase().includes(searchTerm.toLowerCase()))
  }

  const getFilteredWards = () => {
    if (!selectedLGA) return []
    if (!searchTerm) return selectedLGA.wards
    return selectedLGA.wards.filter((ward) => ward.name.toLowerCase().includes(searchTerm.toLowerCase()))
  }

  const getDisplayText = () => {
    if (selectedWard && selectedLGA && selectedState) {
      return `${selectedWard.name}, ${selectedLGA.name}, ${selectedState.name}`
    }
    if (selectedLGA && selectedState) {
      return `${selectedLGA.name}, ${selectedState.name}`
    }
    if (selectedState) {
      return selectedState.name
    }
    return "Select location..."
  }

  const getCurrentStepTitle = () => {
    switch (step) {
      case "state":
        return "Select State"
      case "lga":
        return `Select LGA in ${selectedState?.name}`
      case "ward":
        return `Select Ward in ${selectedLGA?.name}`
      default:
        return "Select Location"
    }
  }

  return (
    <div className="space-y-2">
      {label && (
        <Label className="text-sm font-medium">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </Label>
      )}

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button
            variant="outline"
            className="w-full justify-between text-left font-normal bg-transparent"
            onClick={() => setIsOpen(true)}
          >
            <div className="flex items-center gap-2">
              <MapPin size={16} />
              <span className={getDisplayText() === "Select location..." ? "text-muted-foreground" : ""}>
                {getDisplayText()}
              </span>
            </div>
            <ChevronDown size={16} />
          </Button>
        </DialogTrigger>

        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <MapPin size={20} />
              {getCurrentStepTitle()}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            {/* Progress Indicator */}
            <div className="flex items-center gap-2">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${
                  step === "state"
                    ? "bg-primary text-primary-foreground"
                    : selectedState
                      ? "bg-green-500 text-white"
                      : "bg-muted"
                }`}
              >
                {selectedState ? <Check size={16} /> : "1"}
              </div>
              <div className="flex-1 h-px bg-muted"></div>
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${
                  step === "lga"
                    ? "bg-primary text-primary-foreground"
                    : selectedLGA
                      ? "bg-green-500 text-white"
                      : "bg-muted"
                }`}
              >
                {selectedLGA ? <Check size={16} /> : "2"}
              </div>
              <div className="flex-1 h-px bg-muted"></div>
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${
                  step === "ward"
                    ? "bg-primary text-primary-foreground"
                    : selectedWard
                      ? "bg-green-500 text-white"
                      : "bg-muted"
                }`}
              >
                {selectedWard ? <Check size={16} /> : "3"}
              </div>
            </div>

            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={16} />
              <Input
                placeholder={`Search ${step}s...`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Navigation Buttons */}
            <div className="flex gap-2">
              {step !== "state" && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    if (step === "ward") {
                      setStep("lga")
                      setSelectedWard(null)
                    } else if (step === "lga") {
                      setStep("state")
                      setSelectedLGA(null)
                      setSelectedWard(null)
                    }
                  }}
                >
                  Back
                </Button>
              )}
              <Button variant="outline" size="sm" onClick={resetSelection}>
                Reset
              </Button>
            </div>

            {/* Content */}
            <div className="max-h-96 overflow-y-auto">
              {/* States */}
              {step === "state" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {getFilteredStates().map((state) => (
                    <Card
                      key={state.id}
                      className="p-3 cursor-pointer hover:bg-secondary/50 transition-colors"
                      onClick={() => handleStateSelect(state)}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">{state.name}</p>
                          <p className="text-sm text-muted-foreground">{state.localGovernments.length} LGAs</p>
                        </div>
                        {selectedState?.id === state.id && <Check className="text-green-500" size={16} />}
                      </div>
                    </Card>
                  ))}
                </div>
              )}

              {/* LGAs */}
              {step === "lga" && selectedState && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {getFilteredLGAs().map((lga) => (
                    <Card
                      key={lga.id}
                      className="p-3 cursor-pointer hover:bg-secondary/50 transition-colors"
                      onClick={() => handleLGASelect(lga)}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">{lga.name}</p>
                          <p className="text-sm text-muted-foreground">{lga.wards.length} Wards</p>
                        </div>
                        {selectedLGA?.id === lga.id && <Check className="text-green-500" size={16} />}
                      </div>
                    </Card>
                  ))}
                </div>
              )}

              {/* Wards */}
              {step === "ward" && selectedLGA && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {getFilteredWards().map((ward) => (
                    <Card
                      key={ward.id}
                      className="p-3 cursor-pointer hover:bg-secondary/50 transition-colors"
                      onClick={() => handleWardSelect(ward)}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">{ward.name}</p>
                          <p className="text-sm text-muted-foreground">{ward.cooperatives.length} Cooperatives</p>
                        </div>
                        {selectedWard?.id === ward.id && <Check className="text-green-500" size={16} />}
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
