import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { PsychologistModel } from "@/App";
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";

interface CardProps {
    psychologist: PsychologistModel;
}

const Card2: React.FC<CardProps> = ({ psychologist }) => {
    const getInitials = (name: string) => {
        const nameParts = name.split(" ");
        if (nameParts.length > 2) {
            return (
                nameParts[0][0] + nameParts[nameParts.length - 1][0]
            ).toUpperCase();
        } else {
            return name
                .split(" ")
                .map((n) => n[0])
                .join("")
                .toUpperCase();
        }
    };

    const getFirstEmail = (email: string) => {
        return email ? email.split(",")[0].trim() : "";
    };

    return (
        <Card className="">
            <CardHeader className="flex flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <Avatar>
                        <AvatarFallback className="bg-black text-white">
                            {getInitials(psychologist.nume)}
                        </AvatarFallback>
                    </Avatar>
                    <CardTitle>{psychologist.nume}</CardTitle>
                </div>
                {psychologist.email && (
                    <Button
                        variant="default"
                        size="sm"
                        onClick={() =>
                            (window.location.href = `mailto:${getFirstEmail(
                                psychologist.email
                            )}`)
                        }
                    >
                        Contactează
                    </Button>
                )}
            </CardHeader>
            <CardContent>
                <div className="flex gap-2 mb-4">
                    {psychologist.dgpc && (
                        <Badge className="bg-blue-500 text-white">
                            Din grijǎ pentru copii
                        </Badge>
                    )}
                    {psychologist.tsa && (
                        <Badge className="bg-pink-500 text-white">TSA</Badge>
                    )}
                    {psychologist.expert && (
                        <Badge className="bg-purple-500 text-white">
                            Expert
                        </Badge>
                    )}
                </div>
                <h5 className="mb-4">
                    Cod personal: {psychologist.cod_personal}
                </h5>
                <h3 className="font-semibold mb-4">Specializări</h3>
                <div className="space-y-4">
                    {psychologist.specialitati.map((specialitate, index) => (
                        <Collapsible key={index}>
                            <CollapsibleTrigger asChild>
                                <Card className="shadow-sm w-full cursor-pointer">
                                    <CardHeader className="flex flex-row justify-between items-center p-4 gap-2">
                                        <CardTitle className="text-sm ml-1">
                                            {specialitate.specialitate}
                                        </CardTitle>
                                        <div className="flex items-center !mt-0">
                                            <Badge
                                                className={
                                                    specialitate.status ===
                                                    "Activ"
                                                        ? "bg-green-500 text-white mr-2"
                                                        : "bg-red-500 text-white mr-2"
                                                }
                                            >
                                                {specialitate.status}
                                            </Badge>
                                            <svg
                                                className="h-4 w-4 transition-transform duration-200"
                                                xmlns="http://www.w3.org/2000/svg"
                                                viewBox="0 0 20 20"
                                                fill="currentColor"
                                            >
                                                <path
                                                    fillRule="evenodd"
                                                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                                    clipRule="evenodd"
                                                />
                                            </svg>
                                        </div>
                                    </CardHeader>
                                </Card>
                            </CollapsibleTrigger>
                            <CollapsibleContent>
                                <Card className="shadow-sm w-full mt-2">
                                    <CardContent>
                                        <div className="space-y-2 mt-4">
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm font-medium">
                                                    Număr atestat:
                                                </span>
                                                <span className="text-sm">
                                                    {specialitate.numar_atestat}
                                                </span>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm font-medium">
                                                    Data eliberare:
                                                </span>
                                                <span className="text-sm">
                                                    {
                                                        specialitate.data_eliberare_atestat
                                                    }
                                                </span>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm font-medium">
                                                    Treaptă:
                                                </span>
                                                <span className="text-sm">
                                                    {
                                                        specialitate.treapta_specializare
                                                    }
                                                </span>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm font-medium">
                                                    Regim:
                                                </span>
                                                <span className="text-sm">
                                                    {
                                                        specialitate.regim_exercitare
                                                    }
                                                </span>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm font-medium">
                                                    Filiala:
                                                </span>
                                                <span className="text-sm">
                                                    {specialitate.filiala}
                                                </span>
                                            </div>
                                            <div className="flex items-start justify-between">
                                                <span className="text-sm font-medium">
                                                    Comisia:
                                                </span>
                                                <span className="text-sm text-right">
                                                    {
                                                        specialitate.comisia_de_avizare
                                                    }
                                                </span>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </CollapsibleContent>
                        </Collapsible>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
};

export default Card2;
