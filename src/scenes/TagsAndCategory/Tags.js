import React, { useState, useEffect } from "react";
import axios from "axios";
import { Box, Typography, TextField, Button, useTheme, Card, CardContent, IconButton, Tooltip, Dialog, DialogTitle, DialogContent, DialogActions, List, ListItem, ListItemText } from "@mui/material";
import { tokens } from "../../theme";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import SearchIcon from "@mui/icons-material/Search";
import Header from "../../components/Header";
import Pagination from "./Pagination";
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import API_URL from '../../config';

const Tags = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const [tagInput, setTagInput] = useState("");
    const [tags, setTags] = useState([]);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [tagToDelete, setTagToDelete] = useState(null);
    const [editTag, setEditTag] = useState(null);
    const [sortedBy, setSortedBy] = useState(null);
    const [searchInput, setSearchInput] = useState("");
    const [suggestedTags, setSuggestedTags] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const tagsPerPage = 10;

    useEffect(() => {
        fetchTags();
    }, []);

    const fetchTags = async () => {
        try {
            const response = await axios.get(`${API_URL}/api/tags`);
            if (response.data && Array.isArray(response.data.data)) {
                setTags(response.data.data);
            } else {
                console.error("Response data is not in the expected format:", response.data);
            }
        } catch (error) {
            console.error("Error fetching tags:", error);
        }
    };

    const handleAddTag = async () => {
        try {
            if (tagInput.trim() !== "") {
                const response = await axios.post(`${API_URL}/api/tags`, { name: tagInput.trim() });  // Removed the '#' prefix
                setTags([...tags, response.data.data]);
                setTagInput("");
            }
        } catch (error) {
            console.error("Error adding tag:", error);
        }
    };
    

    const handleKeyPress = (event) => {
        if (event.key === "Enter") {
            handleAddTag();
        }
    };

    const handleDeleteTag = async () => {
        try {
            const response = await axios.delete(`${API_URL}/api/tags/${tagToDelete._id}`);
            if (response.status === 200) {
                const updatedTags = tags.filter((tag) => tag._id !== tagToDelete._id);
                setTags(updatedTags);
                setDeleteDialogOpen(false);
            }
        } catch (error) {
            console.error("Error deleting tag:", error);
        }
    };

    const handleSort = (type) => {
        let sortedTags = [];
        if (type === "name") {
            sortedTags = [...tags].sort((a, b) => a.name.localeCompare(b.name));
        } else if (type === "date") {
            sortedTags = [...tags].sort((a, b) => a._id - b._id);
        }
        setTags(sortedTags);
        setSortedBy(type);
    };

    const handleEditTag = async () => {
        try {
            const editedName = tagInput.trim();  
            const response = await axios.put(`${API_URL}/api/tags/${editTag._id}`, { name: editedName });
            if (response.status === 200) {
                const updatedTags = tags.map((tag) =>
                    tag._id === editTag._id ? { ...tag, name: editedName } : tag
                );
                setTags(updatedTags);
                setEditDialogOpen(false);
                setEditTag(null);
            }
        } catch (error) {
            console.error("Error updating tag:", error);
        }
    };
    

    const handleSearch = async (query) => {
        setSearchInput(query);
        try {
            const response = await axios.get(`${API_URL}/api/tags/suggestions?input=${query}`);
            setSuggestedTags(response.data.data);
        } catch (error) {
            console.error("Error fetching tag suggestions:", error);
        }
    };

    const indexOfLastTag = currentPage * tagsPerPage;
    const indexOfFirstTag = indexOfLastTag - tagsPerPage;
    const currentTags = tags.slice(indexOfFirstTag, indexOfLastTag);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    return (
        <Box mx="auto" maxWidth="800px" px={2}>
            <Header />
            <Typography variant="h4" className="mb-4 text-center">
                <LocalOfferIcon sx={{ fontSize: 36, marginRight: 1 }} />
                Tags
            </Typography>

            <Box className="mb-4 mt-2">
                <TextField
                    label="Add Tag"
                    variant="outlined"
                    color="secondary"
                    fullWidth
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                />
            </Box>
            <Button
                variant="contained"
                color="secondary"
                onClick={handleAddTag}
                className="mt-5"
                style={{ marginLeft: "10px" }}
            >
                Add
            </Button>

            <Box className="mb-4 mt-5">
                <TextField
                    label="Search Tags"
                    variant="outlined"
                    color="secondary"
                    fullWidth
                    value={searchInput}
                    onChange={(e) => handleSearch(e.target.value)}
                    InputProps={{
                        endAdornment: <SearchIcon />,
                    }}
                />
                <List>
                    {suggestedTags.map((tag) => (
                        <ListItem button key={tag._id}>
                            <ListItemText primary={tag.name} />
                        </ListItem>
                    ))}
                </List>
            </Box>
            <Box className="mb-4">
                <Typography variant="h5">Sort By:</Typography>
                <Button
                    variant="outlined"
                    color="secondary"
                    onClick={() => handleSort("name")}
                    startIcon={sortedBy === "name" ? <ArrowDownwardIcon /> : <ArrowUpwardIcon />}
                    style={{ marginRight: "10px" }}
                >
                    Name
                </Button>
                <Button
                    variant="outlined"
                    color="secondary"
                    onClick={() => handleSort("date")}
                    startIcon={sortedBy === "date" ? <ArrowDownwardIcon /> : <ArrowUpwardIcon />}
                >
                    Date
                </Button>
            </Box>
            <Box>
                <Typography variant="h5" className="mb-2">
                    Tags List
                </Typography>
                {currentTags.map((tag, index) => (
                    <Card key={tag._id} className="mb-2">
                        <CardContent className="flex items-center justify-between">
                            <Tooltip title="Edit">
                                <IconButton
                                    onClick={() => {
                                        setEditTag(tag);
                                        setTagInput(tag.name); // Remove "#" before editing
                                        setEditDialogOpen(true);
                                    }}
                                >
                                    <EditIcon />
                                </IconButton>
                            </Tooltip>
                            <Box className={`px-3 py-1 rounded-full bg-${colors.greenAccent[200]} text-${colors.greenAccent[800]} flex items-center`}>
                                <Typography className="ml-1">#{tag.name}</Typography>
                            </Box>
                            <Box>
                                <Tooltip
                                    title="Delete"
                                    onClick={() => {
                                        setTagToDelete(tag);
                                        setDeleteDialogOpen(true);
                                    }}
                                >
                                    <IconButton>
                                        <DeleteIcon />
                                    </IconButton>
                                </Tooltip>
                            </Box>
                        </CardContent>
                    </Card>
                ))}
                <Pagination
                    tagsPerPage={tagsPerPage}
                    totalTags={tags.length}
                    paginate={paginate}
                    currentPage={currentPage}
                />
            </Box>
            <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
                <DialogTitle>Delete Tag</DialogTitle>
                <DialogContent>
                    <Typography>Are you sure you want to delete this tag?</Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDeleteDialogOpen(false)} color="secondary">
                        Cancel
                    </Button>
                    <Button onClick={handleDeleteTag} color="secondary" autoFocus>
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
            <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)}>
                <DialogTitle>Edit Tag</DialogTitle>
                <DialogContent>
                    <TextField
                        label="Edit Tag"
                        variant="outlined"
                        fullWidth
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setEditDialogOpen(false)} color="secondary">
                        Cancel
                    </Button>
                    <Button onClick={handleEditTag} color="secondary" autoFocus>
                        Edit
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default Tags;
