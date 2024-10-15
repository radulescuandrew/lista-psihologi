import React, { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from './supabaseClient';
import { Psychologist } from './types';
import Card from './components/Card';
import SearchBar from './components/SearchBar';
import FilterDropdown from './components/FilterDropdown';
import CheckboxFilter from './components/CheckboxFilter';
import InfiniteScroll from 'react-infinite-scroll-component';

function App() {
  const [psychologists, setPsychologists] = useState<Psychologist[]>([]);
  const [specialties, setSpecialties] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpecialties, setSelectedSpecialties] = useState<string[]>([]);
  const [dgpc, setDgpc] = useState(false);
  const [tsa, setTsa] = useState(false);
  const [expert, setExpert] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [offset, setOffset] = useState(0);
  const LIMIT = 15;

  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    fetchSpecialties();
    // fetchPsychologists(true);
  }, []);

  useEffect(() => {
    fetchPsychologists(true);
  }, [searchTerm, selectedSpecialties, dgpc, tsa, expert]);

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

  const fetchPsychologists = useCallback(async (reset: boolean = false) => {
    try {
      const newOffset = reset ? 0 : offset;
      const params: Record<string, unknown> = {
        _offset: newOffset,
        _limit: LIMIT
      };

      if (searchTerm.trim()) {
        params._nume = searchTerm.trim();
      }

      if (selectedSpecialties.length > 0) {
        params._specialitate = selectedSpecialties;
      }

      if (dgpc) params._dgpc = true;
      if (tsa) params._tsa = true;
      if (expert) params._expert = true;

      const { data, error } = await supabase.rpc('search_psihologi', params);
      if (error) throw error;
      
      if (reset) {
        setPsychologists(data);
      } else {
        setPsychologists(prev => [...prev, ...data]);
      }
      
      setHasMore(data.length === LIMIT);
      setOffset(newOffset + data.length);
    } catch (error) {
      console.error('Error fetching psychologists:', error);
      setError('Failed to fetch psychologists. Please check your Supabase configuration.');
    }
  }, [searchTerm, selectedSpecialties, dgpc, tsa, expert, offset]);

  const loadMore = useCallback(() => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = setTimeout(() => {
      fetchPsychologists();
    }, 700);
  }, [fetchPsychologists]);


  const removeSpecialty = (specialty: string) => {
    setSelectedSpecialties(prev => prev.filter(s => s !== specialty));
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
            <div>
            {specialties.length > 0 && (
              <FilterDropdown
                options={specialties}
                selectedOptions={selectedSpecialties}
                onOptionsChange={setSelectedSpecialties}
                placeholder="Alege specialitatea"
              />
            )}
            </div>
            <div className="flex space-x-4">
              <CheckboxFilter label="DGPC" checked={dgpc} onChange={setDgpc} />
              <CheckboxFilter label="TSA" checked={tsa} onChange={setTsa} />
              <CheckboxFilter label="Expert" checked={expert} onChange={setExpert} />
            </div>
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            {selectedSpecialties.map((specialty) => (
              <div key={specialty} className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm flex items-center">
                {specialty}
                <button onClick={() => removeSpecialty(specialty)} className="ml-2 text-blue-600 hover:text-blue-800">
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
          loader={<h4>Loading...</h4>}
          endMessage={
            <p style={{ textAlign: 'center' }}>
              <b>No more psychologists to load</b>
            </p>
          }
        >
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {psychologists.map((psy) => (
              <Card key={psy.id} psychologist={psy} />
            ))}
          </div>
        </InfiniteScroll>
      </div>
    </div>
  );
}

export default App;