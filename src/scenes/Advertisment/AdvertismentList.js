import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
  Table, TableBody, TableCell, Typography, TableContainer, TableHead, TableRow, 
  Paper, Button, Dialog, DialogActions, DialogContent, DialogContentText, 
  DialogTitle, TextField, MenuItem, Grid, IconButton, Box, Chip,
  Card, CardContent,  Stack, InputAdornment, Zoom,
  Fade, Slide, useTheme, alpha, useMediaQuery
} from '@mui/material';
import { styled } from '@mui/material/styles';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CancelIcon from '@mui/icons-material/Cancel';
import SaveIcon from '@mui/icons-material/Save';
import CloseIcon from '@mui/icons-material/Close';
import LinkIcon from '@mui/icons-material/Link';
import ImageIcon from '@mui/icons-material/Image';
import CategoryIcon from '@mui/icons-material/Category';
import API_URL from '../../config';

// Styled Components
const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
  borderRadius: '16px',
  boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
  overflow: 'hidden',
  '& .MuiTableHead-root': {
    backgroundColor: alpha(theme.palette.primary.main, 0.1),
  },
}));

const StyledTableHead = styled(TableHead)(({ theme }) => ({
  '& .MuiTableCell-head': {
    fontWeight: 'bold',
    color: theme.palette.text.primary,
    borderBottom: `2px solid ${alpha(theme.palette.primary.main, 0.2)}`,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  transition: 'all 0.3s ease',
  '&:hover': {
    backgroundColor: alpha(theme.palette.primary.main, 0.05),
    transform: 'translateY(-2px)',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
  },
}));

const ImageContainer = styled(Box)(({ theme }) => ({
  borderRadius: '8px',
  overflow: 'hidden',
  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  transition: 'transform 0.3s ease',
  '&:hover': {
    transform: 'scale(1.05)',
  },
  '& img': {
    display: 'block',
    width: '100%',
    height: 'auto',
  },
}));

const PositionChip = styled(Chip)(({ theme, position }) => {
  const getColor = () => {
    if (position?.includes('premium')) return theme.palette.warning;
    if (position?.includes('top')) return theme.palette.success;
    if (position?.includes('sidebar')) return theme.palette.info;
    return theme.palette.primary;
  };
  
  return {
    backgroundColor: alpha(getColor().main, 0.1),
    color: getColor().dark,
    fontWeight: 500,
    '& .MuiChip-label': {
      padding: '4px 12px',
    },
  };
});

const PageHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: theme.spacing(3),
  padding: theme.spacing(2, 0),
}));

const TitleWithIcon = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(2),
  '& svg': {
    fontSize: '2rem',
    color: theme.palette.primary.main,
  },
}));

// Mobile Card Component
const MobileAdvertisementCard = styled(Card)(({ theme }) => ({
  borderRadius: '12px',
  marginBottom: theme.spacing(2),
  boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
  transition: 'all 0.3s ease',
  '&:hover': {
    boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
    transform: 'translateY(-4px)',
  },
  [theme.breakpoints.down('sm')]: {
    borderRadius: '12px',
  },
}));

const MobileCardContent = styled(CardContent)(({ theme }) => ({
  padding: theme.spacing(2),
  '&:last-child': {
    paddingBottom: theme.spacing(2),
  },
}));

const InfoRow = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: theme.spacing(1.5),
  [theme.breakpoints.down('sm')]: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: theme.spacing(0.5),
  },
}));

const EditDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialog-paper': {
    borderRadius: '24px',
    padding: theme.spacing(2),
    background: `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${alpha(theme.palette.primary.main, 0.02)} 100%)`,
  },
}));

const DialogHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: theme.spacing(2, 3),
  borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
}));

const DeleteDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialog-paper': {
    borderRadius: '20px',
    padding: theme.spacing(2),
  },
}));

const ActionButton = styled(Button)(({ theme }) => ({
  borderRadius: '8px',
  padding: '6px 16px',
  fontWeight: 500,
  textTransform: 'none',
  transition: 'all 0.3s ease',
}));

const AdvertisementList = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));
  const [advertisements, setAdvertisements] = useState([]);
  const [editingAdvertisement, setEditingAdvertisement] = useState(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleteAdvertisementId, setDeleteAdvertisementId] = useState(null);
  const [editingImage, setEditingImage] = useState(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchAdvertisements();
  }, []);

  const fetchAdvertisements = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/api/advertisements`);
      setAdvertisements(response.data);
    } catch (error) {
      console.error('Error fetching advertisements:', error);
      toast.error('Failed to fetch advertisements');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (advertisement) => {
    setEditingAdvertisement(advertisement);
    setEditDialogOpen(true);
    setEditingImage(null);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('websiteLink', editingAdvertisement.websiteLink);
      formData.append('position', editingAdvertisement.position);
      if (editingImage) {
        formData.append('image', editingImage);
      }

      await axios.put(
        `${API_URL}/api/advertisements/${editingAdvertisement._id}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      setEditDialogOpen(false);
      setEditingAdvertisement(null);
      setEditingImage(null);
      fetchAdvertisements();
      toast.success('Advertisement updated successfully');
    } catch (error) {
      console.error('Error updating advertisement:', error);
      toast.error('Failed to update advertisement');
    }
  };

  const handleDelete = (id) => {
    setDeleteAdvertisementId(id);
    setShowDeleteDialog(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await axios.delete(`${API_URL}/api/advertisements/${deleteAdvertisementId}`);
      fetchAdvertisements();
      toast.success('Advertisement deleted successfully');
      setShowDeleteDialog(false);
    } catch (error) {
      console.error('Error deleting advertisement:', error);
      toast.error('Failed to delete advertisement');
    }
  };

  const getPositionLabel = (position) => {
    return position.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  return (
    <Box sx={{ p: isMobile ? 2 : 3, backgroundColor: '#f8fafc', minHeight: '100vh' }}>
      <PageHeader sx={{ 
        flexDirection: isMobile ? 'column' : 'row',
        gap: isMobile ? 2 : 0,
        alignItems: isMobile ? 'flex-start' : 'center',
      }}>
        <TitleWithIcon>
          <CategoryIcon />
          <Typography variant={isMobile ? "h5" : "h4"} sx={{ fontWeight: 600, color: theme.palette.text.primary }}>
            Advertisement Management
          </Typography>
        </TitleWithIcon>
        <Chip 
          label={`${advertisements.length} Ads`}
          color="primary"
          variant="outlined"
          sx={{ borderRadius: '8px', fontWeight: 500, alignSelf: isMobile ? 'flex-start' : 'auto' }}
        />
      </PageHeader>

      <Fade in={!loading} timeout={800}>
        {isMobile ? (
          // MOBILE CARD VIEW
          <Box>
            {advertisements.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 6 }}>
                <Typography color="textSecondary" variant="body1">
                  No advertisements found
                </Typography>
              </Box>
            ) : (
              advertisements.map((advertisement, index) => (
                <Slide direction="up" in={true} mountOnEnter unmountOnExit timeout={300 + index * 50} key={advertisement._id}>
                  <MobileAdvertisementCard>
                    <MobileCardContent>
                      {/* Image */}
                      <ImageContainer sx={{ maxWidth: '100%', mb: 2 }}>
                        <img
                          src={`${API_URL}/${advertisement.imagePath}`}
                          alt="advertisement"
                          style={{ width: '100%', height: 'auto', borderRadius: '8px' }}
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = '/placeholder-image.jpg';
                          }}
                        />
                      </ImageContainer>

                      {/* Website Link */}
                      <InfoRow>
                        <Typography variant="caption" sx={{ fontWeight: 600, color: theme.palette.text.secondary }}>
                          Website Link
                        </Typography>
                        <Typography variant="body2" sx={{ 
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                          maxWidth: '100%'
                        }}>
                          {advertisement.websiteLink}
                        </Typography>
                      </InfoRow>

                      {/* Position */}
                      <InfoRow>
                        <Typography variant="caption" sx={{ fontWeight: 600, color: theme.palette.text.secondary }}>
                          Position
                        </Typography>
                        <PositionChip
                          position={advertisement.position}
                          label={getPositionLabel(advertisement.position)}
                          size="small"
                        />
                      </InfoRow>

                      {/* Actions */}
                      <Stack direction="row" spacing={1} sx={{ mt: 2, justifyContent: 'flex-end' }}>
                        <IconButton 
                          color="primary" 
                          onClick={() => handleEdit(advertisement)}
                          size="small"
                          sx={{
                            backgroundColor: alpha(theme.palette.primary.main, 0.1),
                            '&:hover': {
                              backgroundColor: alpha(theme.palette.primary.main, 0.2),
                              transform: 'scale(1.1)',
                            },
                            transition: 'all 0.3s ease',
                          }}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                        <IconButton 
                          color="error" 
                          onClick={() => handleDelete(advertisement._id)}
                          size="small"
                          sx={{
                            backgroundColor: alpha(theme.palette.error.main, 0.1),
                            '&:hover': {
                              backgroundColor: alpha(theme.palette.error.main, 0.2),
                              transform: 'scale(1.1)',
                            },
                            transition: 'all 0.3s ease',
                          }}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Stack>
                    </MobileCardContent>
                  </MobileAdvertisementCard>
                </Slide>
              ))
            )}
          </Box>
        ) : (
          // DESKTOP TABLE VIEW
          <StyledTableContainer component={Paper} elevation={0}>
            <Table size={isTablet ? "small" : "medium"}>
              <StyledTableHead>
                <TableRow>
                  <TableCell sx={{
                    minWidth: isTablet ? '120px' : 'auto',
                  }}>Website Link</TableCell>
                  <TableCell sx={{
                    minWidth: isTablet ? '100px' : 'auto',
                  }}>Image</TableCell>
                  <TableCell >Position</TableCell>
                  <TableCell align="center" sx={{
                    minWidth: '80px',
                  }}>Actions</TableCell>
                </TableRow>
              </StyledTableHead>
              <TableBody>
                {advertisements.map((advertisement, index) => (
                  <Slide direction="up" in={true} mountOnEnter unmountOnExit timeout={300 + index * 50} key={advertisement._id}>
                    <StyledTableRow>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <LinkIcon sx={{ color: theme.palette.primary.main, fontSize: 20, flexShrink: 0 }} />
                          <Typography variant="body2" sx={{ 
                            maxWidth: isTablet ? '100px' : '200px',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                            fontSize: isTablet ? '0.7rem' : '0.875rem'
                          }}>
                            {advertisement.websiteLink}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <ImageContainer sx={{ maxWidth: isTablet ? '80px' : '150px' }}>
                          <img
                            src={`${API_URL}/${advertisement.imagePath}`}
                            alt="advertisement"
                            style={{ width: '100%', height: 'auto', borderRadius: '4px' }}
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = '/placeholder-image.jpg';
                            }}
                          />
                        </ImageContainer>
                      </TableCell>
                      <TableCell>
                        <PositionChip
                          position={advertisement.position}
                          label={getPositionLabel(advertisement.position)}
                          size="small"
                        />
                      </TableCell>
                      <TableCell align="center">
                        <Stack direction="row" spacing={0.5} justifyContent="center">
                          <IconButton 
                            color="primary" 
                            onClick={() => handleEdit(advertisement)}
                            size="small"
                            sx={{
                              backgroundColor: alpha(theme.palette.primary.main, 0.1),
                              '&:hover': {
                                backgroundColor: alpha(theme.palette.primary.main, 0.2),
                                transform: 'scale(1.1)',
                              },
                              transition: 'all 0.3s ease',
                            }}
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                          <IconButton 
                            color="error" 
                            onClick={() => handleDelete(advertisement._id)}
                            size="small"
                            sx={{
                              backgroundColor: alpha(theme.palette.error.main, 0.1),
                              '&:hover': {
                                backgroundColor: alpha(theme.palette.error.main, 0.2),
                                transform: 'scale(1.1)',
                              },
                              transition: 'all 0.3s ease',
                            }}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Stack>
                      </TableCell>
                    </StyledTableRow>
                  </Slide>
                ))}
              </TableBody>
            </Table>
          </StyledTableContainer>
        )}
      </Fade>

      {/* Edit Advertisement Modal */}
      <EditDialog 
        open={editDialogOpen} 
        onClose={() => setEditDialogOpen(false)}
        maxWidth="sm"
        fullWidth
        TransitionComponent={Zoom}
      >
        <DialogHeader>
          <Typography variant="h5" sx={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: 1 }}>
            <EditIcon color="primary" />
            Edit Advertisement
          </Typography>
          <IconButton onClick={() => setEditDialogOpen(false)} size="small">
            <CloseIcon />
          </IconButton>
        </DialogHeader>

        <DialogContent sx={{ pt: 3 }}>
          {editingAdvertisement && (
            <form onSubmit={handleUpdate}>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <TextField
                    label="Website Link"
                    fullWidth
                    value={editingAdvertisement.websiteLink}
                    onChange={(e) =>
                      setEditingAdvertisement({
                        ...editingAdvertisement,
                        websiteLink: e.target.value,
                      })
                    }
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <LinkIcon color="primary" />
                        </InputAdornment>
                      ),
                    }}
                    variant="outlined"
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '12px',
                      },
                    }}
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    select
                    label="Position"
                    fullWidth
                    value={editingAdvertisement.position}
                    onChange={(e) =>
                      setEditingAdvertisement({
                        ...editingAdvertisement,
                        position: e.target.value,
                      })
                    }
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <CategoryIcon color="primary" />
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '12px',
                      },
                    }}
                  >
                    <MenuItem value="nepali_top">Nepali Top</MenuItem>
                    <MenuItem value="nepali_belowbreaking">Nepali Below Breaking</MenuItem>
                    <MenuItem value="nepali_belowtourism">Nepali Below Tourism</MenuItem>
                    <MenuItem value="nepali_sidebar1">Nepali Sidebar 1</MenuItem>
                    <MenuItem value="nepali_sidebar2">Nepali Sidebar 2</MenuItem>
                    <MenuItem value="nepali_beloweconomics">Nepali Below Economics</MenuItem>
                    <MenuItem value="nepali_premium">Nepali Premium</MenuItem>
                    <MenuItem value="nepali_belowaviation">Nepali Below Aviation</MenuItem>
                    <MenuItem value="nepali_belowinternational">Nepali Below International</MenuItem>
                    <MenuItem value="nepali_belowthoughts">Nepali Below Thoughts</MenuItem>
                    <MenuItem value="nepali_belowentertainment">Nepali Below Entertainment</MenuItem>
                    <MenuItem value="nepali_belowphotogallery">Nepali Below Photo Gallery</MenuItem>
                    <MenuItem value="nepali_belowvideo">Nepali Below Video</MenuItem>
                    <MenuItem value="nepali_popup">Nepali Popup</MenuItem>
                    <MenuItem value="nepali_middletag">Nepali Middle Tag</MenuItem>
                    <MenuItem value="nepali_belowtag">Nepali Below Tag</MenuItem>
                    <MenuItem value="nepali_incontent">Nepali In Content 1</MenuItem>
                    <MenuItem value="nepali_incontent_2">Nepali In Content 2</MenuItem>
                    <MenuItem value="nepali_incontent_3">Nepali In Content 3</MenuItem>
                    <MenuItem value="english_premium">English Premium</MenuItem>
                    <MenuItem value="english_top">English Top</MenuItem>
                    <MenuItem value="english_top2">English Top 2</MenuItem>
                    <MenuItem value="english_politics">English Politics</MenuItem>
                    <MenuItem value="english_economics">English Economics</MenuItem>
                    <MenuItem value="english_lifestyle">English Lifestyle</MenuItem>
                    <MenuItem value="english_sports">English Sports</MenuItem>
                    <MenuItem value="english_tourism">English Tourism</MenuItem>
                    <MenuItem value="english_sidebar1">English Sidebar 1</MenuItem>
                    <MenuItem value="english_sidebar2">English Sidebar 2</MenuItem>
                    <MenuItem value="english_popup">English Popup</MenuItem>
                    <MenuItem value="english_international">English International</MenuItem>
                    <MenuItem value="english_photogallery">English Photo Gallery</MenuItem>
                    <MenuItem value="english_videogallery">English Video Gallery</MenuItem>
                    <MenuItem value="english_society">English Society</MenuItem>
                    <MenuItem value="english_science">English Science</MenuItem>
                    <MenuItem value="english_incontent">English In Content 1</MenuItem>
                    <MenuItem value="english_incontent_2">English In Content 2</MenuItem>
                    <MenuItem value="english_incontent_3">English In Content 3</MenuItem>
                    <MenuItem value="top">Top</MenuItem>
                    <MenuItem value="middle">Middle</MenuItem>
                    <MenuItem value="bottom">Bottom</MenuItem>
                    <MenuItem value="below_category">Below Category</MenuItem>
                  </TextField>
                </Grid>

                <Grid item xs={12}>
                  <Card variant="outlined" sx={{ borderRadius: '12px', backgroundColor: alpha(theme.palette.primary.main, 0.02) }}>
                    <CardContent>
                      <Typography variant="subtitle2" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                        <ImageIcon color="primary" />
                        Current Image
                      </Typography>
                      <Box sx={{ 
                        display: 'flex', 
                        flexDirection: isMobile ? 'column' : 'row',
                        alignItems: isMobile ? 'flex-start' : 'center', 
                        gap: 2 
                      }}>
                        <ImageContainer sx={{ maxWidth: isMobile ? '100%' : '200px', width: isMobile ? '100%' : 'auto' }}>
                          <img
                            src={`${API_URL}/${editingAdvertisement.imagePath}`}
                            alt="Current advertisement"
                            style={{ width: '100%', height: 'auto', borderRadius: '8px' }}
                          />
                        </ImageContainer>
                        <Box sx={{ flex: isMobile ? '0 0 100%' : 1, width: isMobile ? '100%' : 'auto' }}>
                          <Button
                            variant="outlined"
                            component="label"
                            fullWidth
                            startIcon={<ImageIcon />}
                            sx={{
                              borderRadius: '8px',
                              textTransform: 'none',
                              height: '48px',
                              fontSize: isMobile ? '0.8rem' : '1rem',
                            }}
                          >
                            Change Image (Optional)
                            <input 
                              type="file" 
                              hidden 
                              accept="image/*"
                              onChange={(e) => setEditingImage(e.target.files[0])}
                            />
                          </Button>
                          {editingImage && (
                            <Fade in={true}>
                              <Typography variant="body2" sx={{ mt: 2, color: 'success.main' }}>
                                New image selected: {editingImage.name}
                              </Typography>
                            </Fade>
                          )}
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </form>
          )}
        </DialogContent>

        <DialogActions sx={{ 
          p: isMobile ? 2 : 3, 
          gap: 1,
          flexDirection: isMobile ? 'column-reverse' : 'row',
        }}>
          <ActionButton
            variant="outlined"
            onClick={() => {
              setEditDialogOpen(false);
              setEditingAdvertisement(null);
              setEditingImage(null);
            }}
            startIcon={<CancelIcon />}
            fullWidth={isMobile}
            sx={{ 
              borderColor: alpha(theme.palette.error.main, 0.5), 
              color: theme.palette.error.main,
              fontSize: isMobile ? '0.8rem' : '1rem',
            }}
          >
            Cancel
          </ActionButton>
          <ActionButton
            type="submit"
            variant="contained"
            color="primary"
            onClick={handleUpdate}
            fullWidth={isMobile}
            startIcon={<SaveIcon />}
            sx={{
              background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.primary.dark} 90%)`,
              '&:hover': {
                transform: isMobile ? 'scale(1.02)' : 'translateY(-2px)',
                boxShadow: '0 6px 12px rgba(0,0,0,0.15)',
              },
              fontSize: isMobile ? '0.8rem' : '1rem',
            }}
          >
            Update Advertisement
          </ActionButton>
        </DialogActions>
      </EditDialog>

      {/* Delete Confirmation Dialog */}
      <DeleteDialog 
        open={showDeleteDialog} 
        onClose={() => setShowDeleteDialog(false)}
        TransitionComponent={Zoom}
      >
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <DeleteIcon color="error" />
          <Typography variant="h6">Confirm Delete</Typography>
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this advertisement? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ 
          p: isMobile ? 1.5 : 2, 
          gap: 1,
          flexDirection: isMobile ? 'column-reverse' : 'row',
        }}>
          <ActionButton 
            onClick={() => setShowDeleteDialog(false)} 
            variant="outlined"
            fullWidth={isMobile}
            startIcon={<CancelIcon />}
            sx={{ fontSize: isMobile ? '0.8rem' : '1rem' }}
          >
            Cancel
          </ActionButton>
          <ActionButton 
            onClick={handleDeleteConfirm} 
            color="error" 
            variant="contained"
            fullWidth={isMobile}
            startIcon={<DeleteIcon />}
            sx={{
              fontSize: isMobile ? '0.8rem' : '1rem',
              background: `linear-gradient(45deg, ${theme.palette.error.main} 30%, ${theme.palette.error.dark} 90%)`,
            }}
          >
            Delete
          </ActionButton>
        </DialogActions>
      </DeleteDialog>

      <ToastContainer 
        position="bottom-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
    </Box>
  );
};

export default AdvertisementList;