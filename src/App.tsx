import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import { Psychologist } from './types';
import Card from './components/Card';
import SearchBar from './components/SearchBar';
import FilterDropdown from './components/FilterDropdown';
import CheckboxFilter from './components/CheckboxFilter';

function App() {
  const [psychologists, setPsychologists] = useState<Psychologist[]>([]);
  const [specialties, setSpecialties] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('');
  const [dgpc, setDgpc] = useState(false);
  const [tsa, setTsa] = useState(false);
  const [expert, setExpert] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchSpecialties();
    fetchPsychologists();
  }, []);

  useEffect(() => {
    fetchPsychologists();
  }, [searchTerm, selectedSpecialty, dgpc, tsa, expert]);

  const fetchSpecialties = async () => {
    try {
      const { data, error } = await supabase.rpc('get_unique_specialitate');
      if (error) throw error;
      setSpecialties(data.map((item: { specialitate: string }) => item.specialitate));
    } catch (error) {
      console.error('Error fetching specialties:', error);
      setError('Failed to fetch specialties. Please check your Supabase configuration.');
    }
  };

  const fetchPsychologists = async () => {
    try {
      const params: Record<string, any> = {};

      if (searchTerm.trim()) {
        params._nume = searchTerm.trim();
      }

      if (selectedSpecialty) {
        params._specialitate = selectedSpecialty;
      }

      if (dgpc) params._dgpc = true;
      if (tsa) params._tsa = true;
      if (expert) params._expert = true;

      const { data, error } = await supabase.rpc('search_psihologi', params);
      if (error) throw error;
      setPsychologists(data);
    } catch (error) {
      console.error('Error fetching psychologists:', error);
      setError('Failed to fetch psychologists. Please check your Supabase configuration.');
    }
  };

  if (error) {
    return <div className="text-center text-red-500 mt-8">{error}</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">Psychologist Directory</h1>
        <div className="mb-6 space-y-4">
          <SearchBar searchTerm={searchTerm} onSearchChange={setSearchTerm} />
          <div className="flex space-x-4">
            <div className="w-1/3">
              <FilterDropdown
                options={specialties}
                selectedOption={selectedSpecialty}
                onOptionChange={setSelectedSpecialty}
                placeholder="All Specialties"
              />
            </div>
            <div className="flex space-x-4">
              <CheckboxFilter label="DGPC" checked={dgpc} onChange={setDgpc} />
              <CheckboxFilter label="TSA" checked={tsa} onChange={setTsa} />
              <CheckboxFilter label="Expert" checked={expert} onChange={setExpert} />
            </div>
          </div>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {psychologists.map((psy) => (
            <Card key={psy.id} psychologist={psy} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;