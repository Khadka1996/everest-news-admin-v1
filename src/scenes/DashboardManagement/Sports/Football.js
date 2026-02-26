import React, { useState } from 'react';

const eventTypes = [
  { label: 'Goal', value: 'goal', icon: '⚽', color: 'bg-green-100 text-green-800' },
  { label: 'Yellow Card', value: 'yellow_card', icon: '🟨', color: 'bg-yellow-100 text-yellow-800' },
  { label: 'Red Card', value: 'red_card', icon: '🟥', color: 'bg-red-100 text-red-800' },
  { label: 'Substitution', value: 'substitution', icon: '🔄', color: 'bg-blue-100 text-blue-800' },
  { label: 'Penalty', value: 'penalty', icon: '⚽', color: 'bg-purple-100 text-purple-800' },
  { label: 'Own Goal', value: 'own_goal', icon: '⚽', color: 'bg-orange-100 text-orange-800' },
];

const Football = () => {
  const [events, setEvents] = useState([]);
  const [matchDetails, setMatchDetails] = useState({
    homeTeam: '',
    homeLogo: null,
    opponentTeam: '',
    opponentLogo: null,
    homeScore: '',
    opponentScore: '',
    matchDate: '',
    matchTime: '',
    stadium: '',
    referee: '',
  });
  const [newEvent, setNewEvent] = useState({
    team: '',
    player: '',
    time: '',
    type: '',
    minute: '',
    additionalInfo: '',
  });
  const [editIndex, setEditIndex] = useState(null);
  const [showMatchForm, setShowMatchForm] = useState(true);
  const [activeTab, setActiveTab] = useState('match');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name in matchDetails) {
      setMatchDetails({
        ...matchDetails,
        [name]: value,
      });
    } else {
      setNewEvent({
        ...newEvent,
        [name]: value,
      });
    }
  };

  const handleLogoChange = (e, team) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (team === 'home') {
          setMatchDetails({ ...matchDetails, homeLogo: reader.result });
        } else {
          setMatchDetails({ ...matchDetails, opponentLogo: reader.result });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newEvent.team || !newEvent.player || !newEvent.time || !newEvent.type) {
      alert('Please fill all required fields');
      return;
    }

    const eventWithTimestamp = {
      ...newEvent,
      id: Date.now(),
      minute: newEvent.time,
    };

    if (editIndex !== null) {
      const updatedEvents = [...events];
      updatedEvents[editIndex] = eventWithTimestamp;
      setEvents(updatedEvents);
      setEditIndex(null);
    } else {
      setEvents([...events, eventWithTimestamp]);
    }

    setNewEvent({
      team: '',
      player: '',
      time: '',
      type: '',
      minute: '',
      additionalInfo: '',
    });
  };

  const handleEdit = (index) => {
    setNewEvent(events[index]);
    setEditIndex(index);
    setActiveTab('events');
  };

  const handleDelete = (index) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      const updatedEvents = events.filter((_, i) => i !== index);
      setEvents(updatedEvents);
    }
  };

  const calculateScore = () => {
    const homeGoals = events.filter(
      e => e.team === matchDetails.homeTeam && (e.type === 'goal' || e.type === 'penalty')
    ).length;
    const opponentGoals = events.filter(
      e => e.team === matchDetails.opponentTeam && (e.type === 'goal' || e.type === 'penalty')
    ).length;
    return { homeGoals, opponentGoals };
  };

  const { homeGoals, opponentGoals } = calculateScore();

  const getEventIcon = (type) => {
    const event = eventTypes.find(e => e.value === type);
    return event ? event.icon : '📝';
  };

  const getEventColor = (type) => {
    const event = eventTypes.find(e => e.value === type);
    return event ? event.color : 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">⚽ Football Live Dashboard</h1>
          <p className="text-gray-600">Manage your match details and live events in real-time</p>
        </div>

        {/* Tabs */}
        <div className="flex space-x-4 mb-6">
          <button
            onClick={() => setActiveTab('match')}
            className={`px-6 py-3 rounded-lg font-semibold transition-all ${
              activeTab === 'match'
                ? 'bg-blue-600 text-white shadow-lg'
                : 'bg-white text-gray-600 hover:bg-gray-100'
            }`}
          >
            Match Details
          </button>
          <button
            onClick={() => setActiveTab('events')}
            className={`px-6 py-3 rounded-lg font-semibold transition-all ${
              activeTab === 'events'
                ? 'bg-blue-600 text-white shadow-lg'
                : 'bg-white text-gray-600 hover:bg-gray-100'
            }`}
          >
            Live Events
          </button>
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-6 py-3 rounded-lg font-semibold transition-all ${
              activeTab === 'overview'
                ? 'bg-blue-600 text-white shadow-lg'
                : 'bg-white text-gray-600 hover:bg-gray-100'
            }`}
          >
            Match Overview
          </button>
        </div>

        {/* Match Details Form */}
        {activeTab === 'match' && (
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Match Information</h2>
              <button
                onClick={() => setShowMatchForm(!showMatchForm)}
                className="text-blue-600 hover:text-blue-800"
              >
                {showMatchForm ? 'Hide Form' : 'Show Form'}
              </button>
            </div>

            {showMatchForm && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Home Team */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-700">Home Team</h3>
                  <input
                    type="text"
                    name="homeTeam"
                    placeholder="Home Team Name"
                    value={matchDetails.homeTeam}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <div className="flex items-center space-x-4">
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Team Logo
                      </label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleLogoChange(e, 'home')}
                        className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                      />
                    </div>
                    {matchDetails.homeLogo && (
                      <img src={matchDetails.homeLogo} alt="Home" className="w-16 h-16 rounded-full object-cover" />
                    )}
                  </div>
                </div>

                {/* Opponent Team */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-700">Away Team</h3>
                  <input
                    type="text"
                    name="opponentTeam"
                    placeholder="Away Team Name"
                    value={matchDetails.opponentTeam}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <div className="flex items-center space-x-4">
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Team Logo
                      </label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleLogoChange(e, 'opponent')}
                        className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                      />
                    </div>
                    {matchDetails.opponentLogo && (
                      <img src={matchDetails.opponentLogo} alt="Opponent" className="w-16 h-16 rounded-full object-cover" />
                    )}
                  </div>
                </div>

                {/* Match Details */}
                <div className="col-span-2 grid grid-cols-1 md:grid-cols-3 gap-4">
                  <input
                    type="date"
                    name="matchDate"
                    value={matchDetails.matchDate}
                    onChange={handleInputChange}
                    className="px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="time"
                    name="matchTime"
                    value={matchDetails.matchTime}
                    onChange={handleInputChange}
                    className="px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="text"
                    name="stadium"
                    placeholder="Stadium"
                    value={matchDetails.stadium}
                    onChange={handleInputChange}
                    className="px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="col-span-2">
                  <input
                    type="text"
                    name="referee"
                    placeholder="Referee Name"
                    value={matchDetails.referee}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            )}
          </div>
        )}

        {/* Events Form */}
        {activeTab === 'events' && (
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              {editIndex !== null ? 'Edit Event' : 'Add Live Event'}
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <select
                  name="team"
                  value={newEvent.team}
                  onChange={handleInputChange}
                  className="px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Select Team</option>
                  {matchDetails.homeTeam && (
                    <option value={matchDetails.homeTeam}>{matchDetails.homeTeam}</option>
                  )}
                  {matchDetails.opponentTeam && (
                    <option value={matchDetails.opponentTeam}>{matchDetails.opponentTeam}</option>
                  )}
                </select>

                <input
                  type="text"
                  name="player"
                  placeholder="Player Name"
                  value={newEvent.player}
                  onChange={handleInputChange}
                  className="px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500"
                  required
                />

                <input
                  type="number"
                  name="time"
                  placeholder="Minute"
                  value={newEvent.time}
                  onChange={handleInputChange}
                  className="px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500"
                  required
                  min="1"
                  max="120"
                />

                <select
                  name="type"
                  value={newEvent.type}
                  onChange={handleInputChange}
                  className="px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Event Type</option>
                  {eventTypes.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.icon} {type.label}
                    </option>
                  ))}
                </select>

                <input
                  type="text"
                  name="additionalInfo"
                  placeholder="Additional Info (optional)"
                  value={newEvent.additionalInfo}
                  onChange={handleInputChange}
                  className="px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 md:col-span-2"
                />
              </div>

              <div className="flex space-x-4">
                <button
                  type="submit"
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                >
                  {editIndex !== null ? 'Update Event' : 'Add Event'}
                </button>
                {editIndex !== null && (
                  <button
                    type="button"
                    onClick={() => {
                      setEditIndex(null);
                      setNewEvent({
                        team: '',
                        player: '',
                        time: '',
                        type: '',
                        minute: '',
                        additionalInfo: '',
                      });
                    }}
                    className="px-6 py-3 bg-gray-500 text-white rounded-lg font-semibold hover:bg-gray-600 transition-colors"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>
        )}

        {/* Match Overview */}
        {activeTab === 'overview' && (
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Match Overview</h2>
            
            {/* Score Board */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl p-8 text-white mb-8">
              <div className="flex justify-between items-center">
                <div className="text-center flex-1">
                  {matchDetails.homeLogo ? (
                    <img src={matchDetails.homeLogo} alt={matchDetails.homeTeam} className="w-24 h-24 rounded-full mx-auto mb-4 border-4 border-white" />
                  ) : (
                    <div className="w-24 h-24 rounded-full bg-blue-300 mx-auto mb-4 flex items-center justify-center text-4xl">
                      🏠
                    </div>
                  )}
                  <h3 className="text-2xl font-bold mb-2">{matchDetails.homeTeam || 'Home Team'}</h3>
                  <p className="text-6xl font-bold">{homeGoals}</p>
                </div>
                
                <div className="text-center px-8">
                  <div className="text-4xl font-bold mb-2">VS</div>
                  <div className="text-sm opacity-75">
                    {matchDetails.matchDate && new Date(matchDetails.matchDate).toLocaleDateString()}
                  </div>
                  <div className="text-sm opacity-75">{matchDetails.matchTime}</div>
                </div>
                
                <div className="text-center flex-1">
                  {matchDetails.opponentLogo ? (
                    <img src={matchDetails.opponentLogo} alt={matchDetails.opponentTeam} className="w-24 h-24 rounded-full mx-auto mb-4 border-4 border-white" />
                  ) : (
                    <div className="w-24 h-24 rounded-full bg-blue-300 mx-auto mb-4 flex items-center justify-center text-4xl">
                      🏃
                    </div>
                  )}
                  <h3 className="text-2xl font-bold mb-2">{matchDetails.opponentTeam || 'Away Team'}</h3>
                  <p className="text-6xl font-bold">{opponentGoals}</p>
                </div>
              </div>
              
              {(matchDetails.stadium || matchDetails.referee) && (
                <div className="mt-6 pt-6 border-t border-blue-400 text-center">
                  <p className="text-lg">{matchDetails.stadium}</p>
                  <p className="text-sm opacity-75">Referee: {matchDetails.referee || 'TBA'}</p>
                </div>
              )}
            </div>

            {/* Events Timeline */}
            <h3 className="text-xl font-bold text-gray-800 mb-4">Live Events Timeline</h3>
            {events.length === 0 ? (
              <div className="text-center py-12 bg-gray-50 rounded-xl">
                <p className="text-gray-500 text-lg">No events yet. Start adding live events!</p>
              </div>
            ) : (
              <div className="space-y-3">
                {events.sort((a, b) => a.time - b.time).map((event, index) => (
                  <div
                    key={index}
                    className="flex items-center p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                  >
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xl ${getEventColor(event.type)}`}>
                      {getEventIcon(event.type)}
                    </div>
                    <div className="ml-4 flex-1">
                      <div className="flex items-center">
                        <span className="font-bold text-lg">{event.player}</span>
                        <span className="mx-2 text-gray-500">•</span>
                        <span className="text-blue-600 font-semibold">{event.time}'</span>
                      </div>
                      <div className="text-gray-600">
                        {event.team} - {eventTypes.find(e => e.value === event.type)?.label}
                        {event.additionalInfo && ` (${event.additionalInfo})`}
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(index)}
                        className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                      >
                        ✏️
                      </button>
                      <button
                        onClick={() => handleDelete(index)}
                        className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Live Match Summary (always visible) */}
        {(matchDetails.homeTeam || matchDetails.opponentTeam) && (
          <div className="bg-white rounded-2xl shadow-xl p-6 mt-8">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-4">
                {matchDetails.homeLogo && (
                  <img src={matchDetails.homeLogo} alt={matchDetails.homeTeam} className="w-12 h-12 rounded-full" />
                )}
                <span className="font-bold text-xl">{matchDetails.homeTeam || 'Home'}</span>
              </div>
              <div className="text-3xl font-bold text-blue-600">
                {homeGoals} - {opponentGoals}
              </div>
              <div className="flex items-center space-x-4">
                <span className="font-bold text-xl">{matchDetails.opponentTeam || 'Away'}</span>
                {matchDetails.opponentLogo && (
                  <img src={matchDetails.opponentLogo} alt={matchDetails.opponentTeam} className="w-12 h-12 rounded-full" />
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Football;