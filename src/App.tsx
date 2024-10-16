import React, { useState, useEffect, useCallback, useRef } from "react";
import { supabase } from "./supabaseClient";
import { Psychologist } from "./types";
import SearchBar from "./components/SearchBar";
import FilterDropdown from "./components/FilterDropdown";
import CheckboxFilter from "./components/CheckboxFilter";
import InfiniteScroll from "react-infinite-scroll-component";
import Card from "./components/Card";
import Masonry from "react-masonry-css";

interface Specialitate {
    specialitate: string;
    status: string;
    treapta_specializare: string;
    regim_exercitare: string;
    filiala: string;
    data_eliberare_atestat: string;
    comisia_de_avizare: string;
    numar_atestat: number;
}

export interface PsychologistModel {
    id: number;
    nume: string;
    cod_personal: string;
    dgpc: boolean;
    tsa: boolean;
    expert: boolean;
    email: string;
    specialitati: Specialitate[];
}

function App() {
    const [psychologists, setPsychologists] = useState<PsychologistModel[]>([]);
    const [specialties, setSpecialties] = useState<string[]>([]);
    const [filiale, setFiliale] = useState<string[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedSpecialties, setSelectedSpecialties] = useState<string[]>(
        []
    );
    const [selectedFiliale, setSelectedFiliale] = useState<string[]>([]);
    const [dgpc, setDgpc] = useState(false);
    const [tsa, setTsa] = useState(false);
    const [expert, setExpert] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [hasMore, setHasMore] = useState(true);
    const [offset, setOffset] = useState(0);
    const LIMIT = 30;

    const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        fetchSpecialties();
        fetchFiliale();
    }, []);

    useEffect(() => {
        fetchPsychologists(true);
    }, [searchTerm, selectedSpecialties, selectedFiliale, dgpc, tsa, expert]);

    const fetchSpecialties = async () => {
        try {
            const { data, error } = await supabase.rpc(
                "get_unique_specialitate"
            );
            if (error) throw error;
            setSpecialties(
                data.map((item: { specialitate: string }) => item.specialitate)
            );
        } catch (error) {
            console.error("Error fetching specialties:", error);
            setError(
                "Failed to fetch specialties. Please check your Supabase configuration."
            );
        }
    };

    const fetchFiliale = async () => {
        try {
            const { data, error } = await supabase.rpc("get_unique_filiala");
            if (error) throw error;
            setFiliale(data.map((item: { filiala: string }) => item.filiala));
        } catch (error) {
            console.error("Error fetching filiale:", error);
            setError(
                "Failed to fetch filiale. Please check your Supabase configuration."
            );
        }
    };

    const fetchPsychologists = useCallback(
        async (reset: boolean = false) => {
            try {
                const newOffset = reset ? 0 : offset;
                const params: Record<string, unknown> = {
                    _offset: newOffset,
                    _limit: LIMIT,
                };

                if (searchTerm.trim()) {
                    params._nume = searchTerm.trim();
                }

                if (selectedSpecialties.length > 0) {
                    params._specialitate = selectedSpecialties;
                }

                if (selectedFiliale.length > 0) {
                    params._filiala = selectedFiliale;
                }

                if (dgpc) params._dgpc = true;
                if (tsa) params._tsa = true;
                if (expert) params._expert = true;

                const { data, error } = await supabase.rpc(
                    "search_psihologi",
                    params
                );
                if (error) throw error;

                const reducedData = data.reduce(
                    (acc: PsychologistModel[], curr: Psychologist) => {
                        const existingPsy = acc.find(
                            (p) => p.cod_personal === curr.cod_personal
                        );
                        if (existingPsy) {
                            existingPsy.specialitati.push({
                                specialitate: curr.specialitate,
                                status: curr.status,
                                treapta_specializare: curr.treapta_specializare,
                                regim_exercitare: curr.regim_exercitare,
                                filiala: curr.filiala,
                                data_eliberare_atestat:
                                    curr.data_eliberare_atestat,
                                comisia_de_avizare: curr.comisia_de_avizare,
                                numar_atestat: curr.numar_atestat,
                            });
                        } else {
                            acc.push({
                                id: curr.id,
                                nume: curr.nume,
                                cod_personal: curr.cod_personal,
                                dgpc: curr.dgpc,
                                tsa: curr.tsa,
                                expert: curr.expert,
                                email: curr.email,
                                specialitati: [
                                    {
                                        specialitate: curr.specialitate,
                                        status: curr.status,
                                        treapta_specializare:
                                            curr.treapta_specializare,
                                        regim_exercitare: curr.regim_exercitare,
                                        filiala: curr.filiala,
                                        data_eliberare_atestat:
                                            curr.data_eliberare_atestat,
                                        comisia_de_avizare:
                                            curr.comisia_de_avizare,
                                        numar_atestat: curr.numar_atestat,
                                    },
                                ],
                            });
                        }
                        return acc;
                    },
                    []
                );

                if (reset) {
                    setPsychologists(reducedData);
                } else {
                    setPsychologists((prev) => [...prev, ...reducedData]);
                }

                setHasMore(data.length === LIMIT);
                setOffset(newOffset + data.length);
            } catch (error) {
                console.error("Error fetching psychologists:", error);
                setError(
                    "Failed to fetch psychologists. Please check your Supabase configuration."
                );
            }
        },
        [
            searchTerm,
            selectedSpecialties,
            selectedFiliale,
            dgpc,
            tsa,
            expert,
            offset,
        ]
    );

    const loadMore = useCallback(() => {
        if (debounceTimerRef.current) {
            clearTimeout(debounceTimerRef.current);
        }

        debounceTimerRef.current = setTimeout(() => {
            fetchPsychologists();
        }, 200);
    }, [fetchPsychologists]);

    const removeSpecialty = (specialty: string) => {
        setSelectedSpecialties((prev) => prev.filter((s) => s !== specialty));
    };

    const removeFiliala = (filiala: string) => {
        setSelectedFiliale((prev) => prev.filter((f) => f !== filiala));
    };

    if (error) {
        return <div className="text-center text-red-500 mt-8">{error}</div>;
    }

    const breakpointColumnsObj = {
        default: 2,
        1100: 2,
        700: 1,
    };

    return (
        <div className="min-h-screen bg-gray-100 p-3 sm:p-8">
            <div className="max-w-6xl mx-auto">
                <h1 className="text-3xl font-bold mb-8 text-center">
                    Psychologist Directory
                </h1>
                <div className="mb-6 space-y-4">
                    <SearchBar
                        searchTerm={searchTerm}
                        onSearchChange={setSearchTerm}
                    />
                    {/* <div className="flex flex-col sm:flex-row space-y-4 md:space-y-0 md:space-x-4 flex-wrap"> */}
                    <div className="flex flex-col sm:flex-row flex-wrap gap-4">
                        {/* <div className="relative w-full sm:w-auto"> */}
                        <div className="relative">
                            {specialties.length > 0 && (
                                <FilterDropdown
                                    options={specialties}
                                    selectedOptions={selectedSpecialties}
                                    onOptionsChange={setSelectedSpecialties}
                                    placeholder="Alege specialitatea"
                                />
                            )}
                        </div>
                        {/* <div className="relative w-full sm:w-auto"> */}
                        <div className="relative">
                            {filiale.length > 0 && (
                                <FilterDropdown
                                    options={filiale}
                                    selectedOptions={selectedFiliale}
                                    onOptionsChange={setSelectedFiliale}
                                    placeholder="Alege filiala"
                                />
                            )}
                        </div>
                        <div className="flex flex-wrap gap-4">
                            <CheckboxFilter
                                label="DGPC"
                                checked={dgpc}
                                onChange={setDgpc}
                            />
                            <CheckboxFilter
                                label="TSA"
                                checked={tsa}
                                onChange={setTsa}
                            />
                            <CheckboxFilter
                                label="Expert"
                                checked={expert}
                                onChange={setExpert}
                            />
                        </div>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-2">
                        {selectedSpecialties.map((specialty) => (
                            <div
                                key={specialty}
                                className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm flex items-center"
                            >
                                {specialty}
                                <button
                                    onClick={() => removeSpecialty(specialty)}
                                    className="ml-2 text-blue-600 hover:text-blue-800"
                                >
                                    &times;
                                </button>
                            </div>
                        ))}
                        {selectedFiliale.map((filiala) => (
                            <div
                                key={filiala}
                                className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm flex items-center"
                            >
                                {filiala}
                                <button
                                    onClick={() => removeFiliala(filiala)}
                                    className="ml-2 text-green-600 hover:text-green-800"
                                >
                                    &times;
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
                <InfiniteScroll
                    dataLength={psychologists.length}
                    next={loadMore}
                    hasMore={hasMore}
                    loader={
                        <div className="w-full text-center">
                            <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-900 my-4"></div>
                        </div>
                    }
                    endMessage={
                        psychologists.length > 0 ? (
                            <p style={{ textAlign: "center" }}>
                                <b>{psychologists.length} rezultate gasite</b>
                            </p>
                        ) : (
                            <p style={{ textAlign: "center" }}>
                                <b>
                                    Nu exista rezultate pentru cautarea
                                    dumneavoastra
                                </b>
                            </p>
                        )
                    }
                >
                    <Masonry
                        breakpointCols={breakpointColumnsObj}
                        className="flex -ml-[30px] w-auto"
                        columnClassName="pl-[30px] bg-clip-padding"
                    >
                        {psychologists.map((psy, i) => (
                            <div key={i} className="mb-6">
                                <Card psychologist={psy} />
                            </div>
                        ))}
                    </Masonry>
                </InfiniteScroll>
            </div>
        </div>
    );
}

export default App;
