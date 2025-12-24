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
  IconButton
} from '@mui/material';
import SportsSoccerIcon from '@mui/icons-material/SportsSoccer';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

const eventTypes = [
  { label: 'Goal', value: 'goal' },
  { label: 'Yellow Card', value: 'yellow_card' },
  { label: 'Red Card', value: 'red_card' },
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
  });
  const [newEvent, setNewEvent] = useState({
    team: '',
    player: '',
    time: '',
    type: '',
  });
  const [editIndex, setEditIndex] = useState(null);

  // Function to handle the general input change for event and match details
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

  // Function to handle the logo upload
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
      time: '',
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
          Add Match Details
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

          {/* Final Score */}
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Home Team Score"
              name="homeScore"
              value={matchDetails.homeScore}
              onChange={handleInputChange}
              type="number"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Opponent Team Score"
              name="opponentScore"
              value={matchDetails.opponentScore}
              onChange={handleInputChange}
              type="number"
            />
          </Grid>
        </Grid>
      </Card>

      {/* Event Section */}
      <Card sx={{ padding: '20px', margin: '20px auto', maxWidth: '600px' }}>
        <Typography variant="h5" gutterBottom>
          Add Match Event
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
                label="Time"
                name="time"
                value={newEvent.time}
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
        <Typography variant="h6" gutterBottom>
          Match Events and Final Score
        </Typography>
        <Typography variant="h4" gutterBottom>
          {matchDetails.homeTeam} {matchDetails.homeScore} - {matchDetails.opponentScore} {matchDetails.opponentTeam}
        </Typography>
        <Grid container spacing={2} alignItems="center">
          <Grid item>
            <Avatar src={matchDetails.homeLogo} alt={matchDetails.homeTeam} sx={{ width: 56, height: 56 }} />
          </Grid>
          <Grid item>
            <Typography variant="h6">{matchDetails.homeTeam}</Typography>
          </Grid>
          <Grid item xs={1}>
            <Typography variant="h6">vs</Typography>
          </Grid>
          <Grid item>
            <Typography variant="h6">{matchDetails.opponentTeam}</Typography>
          </Grid>
          <Grid item>
            <Avatar src={matchDetails.opponentLogo} alt={matchDetails.opponentTeam} sx={{ width: 56, height: 56 }} />
          </Grid>
        </Grid>

        <List>
          {events.map((event, index) => (
            <div key={index}>
              <ListItem alignItems="flex-start">
                <ListItemAvatar>
                  <SportsSoccerIcon />
                </ListItemAvatar>
                <ListItemText
                  primary={`${event.player} (${event.time}')`}
                  secondary={`${event.team} - ${eventTypes.find(e => e.value === event.type)?.label}`}
                />
                <IconButton onClick={() => handleEdit(index)}>
                  <EditIcon color="primary" />
                </IconButton>
                <IconButton onClick={() => handleDelete(index)}>
                  <DeleteIcon color="error" />
                </IconButton>
              </ListItem>
              <Divider />
            </div>
          ))}
        </List>
      </Card>
    </div>
  );
};

export default Football;
