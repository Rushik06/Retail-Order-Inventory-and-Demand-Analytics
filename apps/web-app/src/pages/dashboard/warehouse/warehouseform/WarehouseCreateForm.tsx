/* eslint-disable */
import { useState, useEffect } from "react";
import { Plus } from "lucide-react";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

import {
  validateWarehouseName,
  validateLocation,
  isWarehouseFormValid
} from "@/utils/warehouse-validation";

export default function WarehouseCreateForm({
  name,
  setName,
  location,
  setLocation,
  handleCreate,
}: any) {

  const [nameError, setNameError] = useState("");
  const [locationError, setLocationError] = useState("");

  const [nameTouched, setNameTouched] = useState(false);
  const [locationTouched, setLocationTouched] = useState(false);

  useEffect(() => {

    if (!nameTouched) return;

    if (name === "") {
      setNameError("");
      return;
    }

    setNameError(validateWarehouseName(name));

  }, [name, nameTouched]);

  useEffect(() => {

    if (!locationTouched) return;

    if (location === "") {
      setLocationError("");
      return;
    }

    setLocationError(validateLocation(location));

  }, [location, locationTouched]);

  const isValid = isWarehouseFormValid(name, location);

  const handleCreateClick = async () => {

    await handleCreate();

    setNameTouched(false);
    setLocationTouched(false);
    setNameError("");
    setLocationError("");

  };

  return (

    <Card className="shadow-sm">

      <CardHeader>
        <CardTitle className="text-lg font-semibold">
          Create Warehouse
        </CardTitle>
      </CardHeader>

      <CardContent>

        <div className="grid grid-cols-3 gap-6 items-start max-w-3xl">

          {/* NAME */}

          <div className="flex flex-col gap-1">

            <label className="text-sm font-medium text-gray-700">
              Warehouse Name
            </label>

            <Input
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setNameTouched(true);
              }}
              placeholder="Enter warehouse name"
              className={nameError ? "border-red-500 focus:border-red-500" : ""}
            />

            {nameError && (
              <span className="text-red-500 text-xs">
                {nameError}
              </span>
            )}

          </div>

          {/* LOCATION */}

          <div className="flex flex-col gap-1">

            <label className="text-sm font-medium text-gray-700">
              Location
            </label>

            <Input
              value={location}
              onChange={(e) => {
                setLocation(e.target.value);
                setLocationTouched(true);
              }}
              placeholder="Enter location"
              className={locationError ? "border-red-500 focus:border-red-500" : ""}
            />

            {locationError && (
              <span className="text-red-500 text-xs">
                {locationError}
              </span>
            )}

          </div>

          {/* BUTTON */}

          <div className="flex items-end h-[60px]">

            <Button
              className="bg-blue-600 hover:bg-blue-700 text-white w-full"
              disabled={!isValid}
              onClick={handleCreateClick}
            >
              <Plus size={16} className="mr-2" />
              Create
            </Button>

          </div>

        </div>

      </CardContent>

    </Card>

  );
}