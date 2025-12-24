import React, { useState } from 'react';
import {
  Grid,
  Card,
  Typography,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Divider,
  Button,
  TextField,
  MenuItem,
  IconButton,
} from '@mui/material';
import SportsCricketIcon from '@mui/icons-material/SportsCricket';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

const eventTypes = [
  { label: 'Run', value: 'run' },
  { label: 'Wicket', value: 'wicket' },
  { label: 'Wide Ball', value: 'wide_ball' },
  { label: 'No Ball', value: 'no_ball' },
  { label: 'Four', value: 'four' },
  { label: 'Six', value: 'six' },
];

const Cricket = () => {
  const [events, setEvents] = useState([]);
  const [matchDetails, setMatchDetails] = useState({
    homeTeam: '',
    homeLogo: null,
    opponentTeam: '',
    opponentLogo: null,
    homeScore: { runs: '', wickets: '', overs: '' },
    opponentScore: { runs: '', wickets: '', overs: '' },
  });
  const [newEvent, setNewEvent] = useState({
    team: '',
    player: '',
    runs: '',
    overs: '',
    type: '',
  });
  const [editIndex, setEditIndex] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('homeScore') || name.includes('opponentScore')) {
      const [team, key] = name.split('.');
      setMatchDetails({
        ...matchDetails,
        [team]: {
          ...matchDetails[team],
          [key]: value,
        },
      });
    } else if (name in matchDetails) {
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
    if (editIndex !== null) {
      const updatedEvents = [...events];
      updatedEvents[editIndex] = newEvent;
      setEvents(updatedEvents);
      setEditIndex(null);
    } else {
      setEvents([...events, newEvent]);
    }
    setNewEvent({
      team: '',
      player: '',
      runs: '',
      overs: '',
      type: '',
    });
  };

  const handleEdit = (index) => {
    setNewEvent(events[index]);
    setEditIndex(index);
  };

  const handleDelete = (index) => {
    const updatedEvents = events.filter((_, i) => i !== index);
    setEvents(updatedEvents);
  };

  return (
    <div>
      {/* Match Details Section */}
      <Card sx={{ padding: '20px', margin: '20px auto', maxWidth: '600px' }}>
        <Typography variant="h5" gutterBottom>
          Add Cricket Match Details
        </Typography>
        <Grid container spacing={2}>
          {/* Home Team */}
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Home Team"
              name="homeTeam"
              value={matchDetails.homeTeam}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="body1">Home Team Logo</Typography>
            <input type="file" accept="image/*" onChange={(e) => handleLogoChange(e, 'home')} />
          </Grid>

          {/* Opponent Team */}
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Opponent Team"
              name="opponentTeam"
              value={matchDetails.opponentTeam}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="body1">Opponent Team Logo</Typography>
            <input type="file" accept="image/*" onChange={(e) => handleLogoChange(e, 'opponent')} />
          </Grid>

          {/* Final Score for Home Team */}
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="Home Team Runs"
              name="homeScore.runs"
              value={matchDetails.homeScore.runs}
              onChange={handleInputChange}
              type="number"
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="Home Team Wickets"
              name="homeScore.wickets"
              value={matchDetails.homeScore.wickets}
              onChange={handleInputChange}
              type="number"
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="Home Team Overs"
              name="homeScore.overs"
              value={matchDetails.homeScore.overs}
              onChange={handleInputChange}
              type="number"
            />
          </Grid>

          {/* Final Score for Opponent Team */}
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="Opponent Team Runs"
              name="opponentScore.runs"
              value={matchDetails.opponentScore.runs}
              onChange={handleInputChange}
              type="number"
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="Opponent Team Wickets"
              name="opponentScore.wickets"
              value={matchDetails.opponentScore.wickets}
              onChange={handleInputChange}
              type="number"
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="Opponent Team Overs"
              name="opponentScore.overs"
              value={matchDetails.opponentScore.overs}
              onChange={handleInputChange}
              type="number"
            />
          </Grid>
        </Grid>
      </Card>

      {/* Event Section */}
      <Card sx={{ padding: '20px', margin: '20px auto', maxWidth: '600px' }}>
        <Typography variant="h5" gutterBottom>
          Add Cricket Event
        </Typography>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Team"
                name="team"
                value={newEvent.team}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Player"
                name="player"
                value={newEvent.player}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Overs"
                name="overs"
                value={newEvent.overs}
                onChange={handleInputChange}
                type="number"
                InputProps={{
                  endAdornment: <AccessTimeIcon />,
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Event Type"
                name="type"
                select
                value={newEvent.type}
                onChange={handleInputChange}
              >
                {eventTypes.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <Button type="submit" variant="contained" color="primary">
                {editIndex !== null ? 'Update Event' : 'Add Event'}
              </Button>
            </Grid>
          </Grid>
        </form>
      </Card>

      {/* Match and Event List Section */}
      <Card sx={{ padding: '20px', margin: '20px auto', maxWidth: '900px' }}>
        <Typography variant="h5" gutterBottom>
          Match Events
        </Typography>
        <Grid container spacing={2} alignItems="center">
          {/* Score Header */}
          <Grid item xs={6} textAlign="center">
            {matchDetails.homeLogo && <Avatar src={matchDetails.homeLogo} alt="Home Team Logo" />}
            <Typography variant="h6">{matchDetails.homeTeam}</Typography>
            <Typography variant="body1">
              {matchDetails.homeScore.runs}/{matchDetails.homeScore.wickets} ({matchDetails.homeScore.overs} overs)
            </Typography>
          </Grid>
          <Grid item xs={6} textAlign="center">
            {matchDetails.opponentLogo && <Avatar src={matchDetails.opponentLogo} alt="Opponent Team Logo" />}
            <Typography variant="h6">{matchDetails.opponentTeam}</Typography>
            <Typography variant="body1">
              {matchDetails.opponentScore.runs}/{matchDetails.opponentScore.wickets} ({matchDetails.opponentScore.overs} overs)
            </Typography>
          </Grid>

          {/* Event List */}
          <Grid item xs={12}>
            <List>
              {events.map((event, index) => (
                <React.Fragment key={index}>
                  <ListItem>
                    <ListItemAvatar>
                      <Avatar>
                        <SportsCricketIcon />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={`Team: ${event.team} - Player: ${event.player}`}
                      secondary={`Event: ${event.type} - Runs: ${event.runs} - Overs: ${event.overs}`}
                    />
                    <IconButton edge="end" aria-label="edit" onClick={() => handleEdit(index)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton edge="end" aria-label="delete" onClick={() => handleDelete(index)}>
                      <DeleteIcon />
                    </IconButton>
                  </ListItem>
                  <Divider />
                </React.Fragment>
              ))}
            </List>
          </Grid>
        </Grid>
      </Card>
    </div>
  );
};

export default Cricket;
