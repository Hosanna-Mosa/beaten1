import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  IconButton,
  Paper,
  Stack,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "axios";

const DATA_ENTRY_ID = "68764ef87d492357106bb01d"; // Use your actual DataEntry ID
const API_BASE_URL =
  process.env.REACT_APP_API_URL || "http://localhost:8000/api";

const DataEntry = () => {
  const [slideImages, setSlideImages] = useState([]);
  const [newsContent, setNewsContent] = useState("");
  const [editIndex, setEditIndex] = useState(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [newImageFile, setNewImageFile] = useState(null);
  const [newImagePreview, setNewImagePreview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updating, setUpdating] = useState(false);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [addImageFile, setAddImageFile] = useState(null);
  const [addImagePreview, setAddImagePreview] = useState(null);
  const [adding, setAdding] = useState(false);
  const [newsLoading, setNewsLoading] = useState(true);
  const [newsError, setNewsError] = useState(null);
  const [newsUpdating, setNewsUpdating] = useState(false);
  const [newsChanged, setNewsChanged] = useState(false);

  // Mobile slides state
  const [mobileSlideImages, setMobileSlideImages] = useState([]);
  const [mobileLoading, setMobileLoading] = useState(true);
  const [mobileError, setMobileError] = useState(null);
  const [mobileEditDialogOpen, setMobileEditDialogOpen] = useState(false);
  const [mobileEditIndex, setMobileEditIndex] = useState(null);
  const [mobileSelectedImage, setMobileSelectedImage] = useState(null);
  const [mobileNewImageFile, setMobileNewImageFile] = useState(null);
  const [mobileNewImagePreview, setMobileNewImagePreview] = useState(null);
  const [mobileUpdating, setMobileUpdating] = useState(false);
  const [mobileAddDialogOpen, setMobileAddDialogOpen] = useState(false);
  const [mobileAddImageFile, setMobileAddImageFile] = useState(null);
  const [mobileAddImagePreview, setMobileAddImagePreview] = useState(null);
  const [mobileAdding, setMobileAdding] = useState(false);

  useEffect(() => {
    const getImages = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await axios.get(
          `${API_BASE_URL}/data-entry/${DATA_ENTRY_ID}/slide-images`
        );
        setSlideImages(response.data.slideImages || []);
      } catch (err) {
        setError(err.message || "Failed to load images");
      } finally {
        setLoading(false);
      }
    };
    getImages();
    // Fetch news content
    const getNewsContent = async () => {
      try {
        setNewsLoading(true);
        setNewsError(null);
        const response = await axios.get(
          `${API_BASE_URL}/data-entry/${DATA_ENTRY_ID}/news-content`
        );
        setNewsContent(response.data.newsContent || "");
      } catch (err) {
        setNewsError(err.message || "Failed to load news content");
      } finally {
        setNewsLoading(false);
      }
    };
    getNewsContent();
  }, []);

  // Fetch mobile slides on mount
  useEffect(() => {
    const getMobileSlides = async () => {
      try {
        setMobileLoading(true);
        setMobileError(null);
        const response = await axios.get(
          `${API_BASE_URL}/data-entry/${DATA_ENTRY_ID}/mobile-slide-images`
        );
        setMobileSlideImages(response.data.mobileSlideImages || []);
      } catch (err) {
        setMobileError(err.message || "Failed to load mobile images");
      } finally {
        setMobileLoading(false);
      }
    };
    getMobileSlides();
  }, []);

  const handleDeleteImage = async (index) => {
    if (slideImages.length <= 1) {
      alert("At least one image is required.");
      return;
    }
    const updatedImages = slideImages.filter((_, i) => i !== index);
    setSlideImages(updatedImages);
    try {
      await axios.put(
        `${API_BASE_URL}/data-entry/${DATA_ENTRY_ID}/slide-images`,
        { slideImages: updatedImages }
      );
    } catch (err) {
      alert(
        "Failed to update images: " +
          (err.response?.data?.message || err.message)
      );
    }
  };

  const handleEditImage = (index) => {
    setEditIndex(index);
    setSelectedImage(slideImages[index]);
    setNewImageFile(null);
    setNewImagePreview(null);
    setEditDialogOpen(true);
  };

  const handleDialogClose = () => {
    setEditDialogOpen(false);
    setEditIndex(null);
    setSelectedImage(null);
    setNewImageFile(null);
    setNewImagePreview(null);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      setNewImageFile(file);
      setNewImagePreview(URL.createObjectURL(file));
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewImageFile(file);
      setNewImagePreview(URL.createObjectURL(file));
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleUpdateImage = async () => {
    if (!newImageFile) return;
    setUpdating(true);
    try {
      // 1. Upload image to backend
      const formData = new FormData();
      formData.append("image", newImageFile);
      const uploadRes = await axios.post(
        `${API_BASE_URL}/upload/image`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      const imageUrl = uploadRes.data.imageUrl;
      // 2. Update slideImages array
      const updatedImages = slideImages.map((img, i) =>
        i === editIndex ? imageUrl : img
      );
      setSlideImages(updatedImages);
      // 3. Persist to backend
      await axios.put(
        `${API_BASE_URL}/data-entry/${DATA_ENTRY_ID}/slide-images`,
        { slideImages: updatedImages }
      );
      handleDialogClose();
    } catch (err) {
      alert(
        "Failed to update image: " +
          (err.response?.data?.message || err.message)
      );
    } finally {
      setUpdating(false);
    }
  };

  // Add image dialog handlers
  const handleAddDialogOpen = () => {
    setAddDialogOpen(true);
    setAddImageFile(null);
    setAddImagePreview(null);
  };
  const handleAddDialogClose = () => {
    setAddDialogOpen(false);
    setAddImageFile(null);
    setAddImagePreview(null);
  };
  const handleAddDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      setAddImageFile(file);
      setAddImagePreview(URL.createObjectURL(file));
    }
  };
  const handleAddFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAddImageFile(file);
      setAddImagePreview(URL.createObjectURL(file));
    }
  };
  const handleAddDragOver = (e) => {
    e.preventDefault();
  };
  const handleAddImage = async () => {
    if (!addImageFile) return;
    setAdding(true);
    try {
      // 1. Upload image to backend
      const formData = new FormData();
      formData.append("image", addImageFile);
      const uploadRes = await axios.post(
        `${API_BASE_URL}/upload/image`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      const imageUrl = uploadRes.data.imageUrl;
      // 2. Add to slideImages array
      const updatedImages = [...slideImages, imageUrl];
      setSlideImages(updatedImages);
      // 3. Persist to backend
      await axios.put(
        `${API_BASE_URL}/data-entry/${DATA_ENTRY_ID}/slide-images`,
        { slideImages: updatedImages }
      );
      handleAddDialogClose();
    } catch (err) {
      alert(
        "Failed to add image: " + (err.response?.data?.message || err.message)
      );
    } finally {
      setAdding(false);
    }
  };

  // Mobile: Add
  const handleMobileAddDialogOpen = () => {
    setMobileAddDialogOpen(true);
    setMobileAddImageFile(null);
    setMobileAddImagePreview(null);
  };
  const handleMobileAddDialogClose = () => {
    setMobileAddDialogOpen(false);
    setMobileAddImageFile(null);
    setMobileAddImagePreview(null);
  };
  const handleMobileAddDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      setMobileAddImageFile(file);
      setMobileAddImagePreview(URL.createObjectURL(file));
    }
  };
  const handleMobileAddFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setMobileAddImageFile(file);
      setMobileAddImagePreview(URL.createObjectURL(file));
    }
  };
  const handleMobileAddDragOver = (e) => {
    e.preventDefault();
  };
  const handleMobileAddImage = async () => {
    if (!mobileAddImageFile) return;
    setMobileAdding(true);
    try {
      const formData = new FormData();
      formData.append("image", mobileAddImageFile);
      const uploadRes = await axios.post(
        `${API_BASE_URL}/upload/image`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      const imageUrl = uploadRes.data.imageUrl;
      const updatedImages = [...mobileSlideImages, imageUrl];
      setMobileSlideImages(updatedImages);
      await axios.put(
        `${API_BASE_URL}/data-entry/${DATA_ENTRY_ID}/mobile-slide-images`,
        { mobileSlideImages: updatedImages }
      );
      handleMobileAddDialogClose();
    } catch (err) {
      alert(
        "Failed to add mobile image: " +
          (err.response?.data?.message || err.message)
      );
    } finally {
      setMobileAdding(false);
    }
  };

  // Mobile: Edit
  const handleMobileEditImage = (index) => {
    setMobileEditIndex(index);
    setMobileSelectedImage(mobileSlideImages[index]);
    setMobileNewImageFile(null);
    setMobileNewImagePreview(null);
    setMobileEditDialogOpen(true);
  };
  const handleMobileEditDialogClose = () => {
    setMobileEditDialogOpen(false);
    setMobileEditIndex(null);
    setMobileSelectedImage(null);
    setMobileNewImageFile(null);
    setMobileNewImagePreview(null);
  };
  const handleMobileDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      setMobileNewImageFile(file);
      setMobileNewImagePreview(URL.createObjectURL(file));
    }
  };
  const handleMobileFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setMobileNewImageFile(file);
      setMobileNewImagePreview(URL.createObjectURL(file));
    }
  };
  const handleMobileDragOver = (e) => {
    e.preventDefault();
  };
  const handleMobileUpdateImage = async () => {
    if (!mobileNewImageFile) return;
    setMobileUpdating(true);
    try {
      const formData = new FormData();
      formData.append("image", mobileNewImageFile);
      const uploadRes = await axios.post(
        `${API_BASE_URL}/upload/image`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      const imageUrl = uploadRes.data.imageUrl;
      const updatedImages = mobileSlideImages.map((img, i) =>
        i === mobileEditIndex ? imageUrl : img
      );
      setMobileSlideImages(updatedImages);
      await axios.put(
        `${API_BASE_URL}/data-entry/${DATA_ENTRY_ID}/mobile-slide-images`,
        { mobileSlideImages: updatedImages }
      );
      handleMobileEditDialogClose();
    } catch (err) {
      alert(
        "Failed to update mobile image: " +
          (err.response?.data?.message || err.message)
      );
    } finally {
      setMobileUpdating(false);
    }
  };

  // Mobile: Delete
  const handleMobileDeleteImage = async (index) => {
    if (mobileSlideImages.length <= 1) {
      alert("At least one image is required.");
      return;
    }
    const updatedImages = mobileSlideImages.filter((_, i) => i !== index);
    setMobileSlideImages(updatedImages);
    try {
      await axios.put(
        `${API_BASE_URL}/data-entry/${DATA_ENTRY_ID}/mobile-slide-images`,
        { mobileSlideImages: updatedImages }
      );
    } catch (err) {
      alert(
        "Failed to update mobile images: " +
          (err.response?.data?.message || err.message)
      );
    }
  };

  const handleNewsContentChange = (e) => {
    setNewsContent(e.target.value);
    setNewsChanged(true);
  };
  const handleUpdateNewsContent = async () => {
    setNewsUpdating(true);
    try {
      await axios.put(
        `${API_BASE_URL}/data-entry/${DATA_ENTRY_ID}/news-content`,
        { newsContent }
      );
      setNewsChanged(false);
    } catch (err) {
      alert(
        "Failed to update news content: " +
          (err.response?.data?.message || err.message)
      );
    } finally {
      setNewsUpdating(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 700, mx: "auto", mt: 4, p: 2 }}>
      <Typography variant="h4" gutterBottom>
        Data Entry
      </Typography>
      {/* Dekstop */}
      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          DekStop Slide Images
        </Typography>
        <Button
          variant="outlined"
          color="primary"
          sx={{ mb: 2 }}
          onClick={handleAddDialogOpen}
        >
          Add Image
        </Button>
        {loading ? (
          <Typography>Loading images...</Typography>
        ) : error ? (
          <Typography color="error">{error}</Typography>
        ) : (
          <List>
            {slideImages.map((img, idx) => (
              <ListItem key={idx}>
                <img
                  src={img}
                  alt={`slide-${idx}`}
                  style={{
                    width: 60,
                    height: 40,
                    objectFit: "cover",
                    marginRight: 12,
                    borderRadius: 4,
                    border: "1px solid #eee",
                  }}
                />
                {/* <ListItemText primary={img} /> */}
                <ListItemSecondaryAction>
                  <Button onClick={() => handleEditImage(idx)} size="small">
                    Edit
                  </Button>
                  <IconButton
                    edge="end"
                    color="error"
                    onClick={() => handleDeleteImage(idx)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>
        )}
      </Paper>

      {/* mobile  */}
      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          Mobile Slide Images
        </Typography>
        <Button
          variant="outlined"
          color="primary"
          sx={{ mb: 2 }}
          onClick={handleMobileAddDialogOpen}
        >
          Add Image
        </Button>
        {mobileLoading ? (
          <Typography>Loading images...</Typography>
        ) : mobileError ? (
          <Typography color="error">{mobileError}</Typography>
        ) : (
          <List>
            {mobileSlideImages.map((img, idx) => (
              <ListItem key={idx}>
                <img
                  src={img}
                  alt={`mobile-slide-${idx}`}
                  style={{
                    width: 60,
                    height: 40,
                    objectFit: "cover",
                    marginRight: 12,
                    borderRadius: 4,
                    border: "1px solid #eee",
                  }}
                />
                <ListItemSecondaryAction>
                  <Button
                    onClick={() => handleMobileEditImage(idx)}
                    size="small"
                  >
                    Edit
                  </Button>
                  <IconButton
                    edge="end"
                    color="error"
                    onClick={() => handleMobileDeleteImage(idx)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>
        )}
      </Paper>
      {/* Mobile Add Image Dialog */}
      <Dialog
        open={mobileAddDialogOpen}
        onClose={handleMobileAddDialogClose}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>Add Mobile Slide Image</DialogTitle>
        <DialogContent>
          <Box
            onDrop={handleMobileAddDrop}
            onDragOver={handleMobileAddDragOver}
            sx={{
              border: "2px dashed #aaa",
              borderRadius: 6,
              p: 2,
              textAlign: "center",
              mb: 2,
              background: "#fafafa",
              cursor: "pointer",
            }}
            onClick={() =>
              document.getElementById("mobile-add-file-input").click()
            }
          >
            <input
              id="mobile-add-file-input"
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              onChange={handleMobileAddFileChange}
            />
            {mobileAddImagePreview ? (
              <img
                src={mobileAddImagePreview}
                alt="preview"
                style={{
                  width: 180,
                  height: 120,
                  objectFit: "cover",
                  borderRadius: 6,
                  border: "1px solid #eee",
                }}
              />
            ) : (
              <Typography variant="body2" color="textSecondary">
                Drag & drop a new image here, or click to select
              </Typography>
            )}
            {/* Mobile recommended size */}
            <Box sx={{ mt: 1 }}>
              <Typography variant="caption" color="textSecondary">
                Recommended size (Mobile): <b>800 x 800 px</b>
              </Typography>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleMobileAddDialogClose}>Cancel</Button>
          <Button
            onClick={handleMobileAddImage}
            variant="contained"
            color="primary"
            disabled={!mobileAddImagePreview || mobileAdding}
          >
            {mobileAdding ? "Uploading..." : "Upload Image"}
          </Button>
        </DialogActions>
      </Dialog>
      {/* Mobile Edit Image Dialog */}
      <Dialog
        open={mobileEditDialogOpen}
        onClose={handleMobileEditDialogClose}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>Edit Mobile Slide Image</DialogTitle>
        <DialogContent>
          <Box sx={{ mb: 2, textAlign: "center" }}>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              Current Image
            </Typography>
            {mobileSelectedImage && (
              <img
                src={mobileSelectedImage}
                alt="current"
                style={{
                  width: 180,
                  height: 120,
                  objectFit: "cover",
                  borderRadius: 6,
                  border: "1px solid #eee",
                }}
              />
            )}
          </Box>
          <Divider sx={{ mb: 2 }} />
          <Box
            onDrop={handleMobileDrop}
            onDragOver={handleMobileDragOver}
            sx={{
              border: "2px dashed #aaa",
              borderRadius: 6,
              p: 2,
              textAlign: "center",
              mb: 2,
              background: "#fafafa",
              cursor: "pointer",
            }}
            onClick={() => document.getElementById("mobile-file-input").click()}
          >
            <input
              id="mobile-file-input"
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              onChange={handleMobileFileChange}
            />
            {mobileNewImagePreview ? (
              <img
                src={mobileNewImagePreview}
                alt="preview"
                style={{
                  width: 180,
                  height: 120,
                  objectFit: "cover",
                  borderRadius: 6,
                  border: "1px solid #eee",
                }}
              />
            ) : (
              <Typography variant="body2" color="textSecondary">
                Drag & drop a new image here, or click to select
              </Typography>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleMobileEditDialogClose}>Cancel</Button>
          <Button
            onClick={handleMobileUpdateImage}
            variant="contained"
            color="primary"
            disabled={!mobileNewImagePreview || mobileUpdating}
          >
            {mobileUpdating ? "Updating..." : "Update Image"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* newscroller */}
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          News Content
        </Typography>
        {newsLoading ? (
          <Typography>Loading news content...</Typography>
        ) : newsError ? (
          <Typography color="error">{newsError}</Typography>
        ) : (
          <>
            <TextField
              label="News Content"
              value={newsContent}
              onChange={handleNewsContentChange}
              fullWidth
              multiline
              minRows={3}
              sx={{ mb: 2 }}
            />
            <Button
              variant="contained"
              color="primary"
              onClick={handleUpdateNewsContent}
              disabled={!newsChanged || newsUpdating}
            >
              {newsUpdating ? "Updating..." : "Update News Content"}
            </Button>
          </>
        )}
      </Paper>
      {/* Save/Update button for backend integration later */}

      {/* Edit Image Dialog */}
      <Dialog
        open={editDialogOpen}
        onClose={handleDialogClose}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>Edit Slide Image</DialogTitle>
        <DialogContent>
          {/* Top: Existing image */}
          <Box sx={{ mb: 2, textAlign: "center" }}>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              Current Image
            </Typography>
            {selectedImage && (
              <img
                src={selectedImage}
                alt="current"
                style={{
                  width: 180,
                  height: 120,
                  objectFit: "cover",
                  borderRadius: 6,
                  border: "1px solid #eee",
                }}
              />
            )}
          </Box>
          <Divider sx={{ mb: 2 }} />
          {/* Bottom: Drag and drop */}
          <Box
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            sx={{
              border: "2px dashed #aaa",
              borderRadius: 6,
              p: 2,
              textAlign: "center",
              mb: 2,
              background: "#fafafa",
              cursor: "pointer",
            }}
            onClick={() => document.getElementById("file-input").click()}
          >
            <input
              id="file-input"
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              onChange={handleFileChange}
            />
            {newImagePreview ? (
              <img
                src={newImagePreview}
                alt="preview"
                style={{
                  width: 180,
                  height: 120,
                  objectFit: "cover",
                  borderRadius: 6,
                  border: "1px solid #eee",
                }}
              />
            ) : (
              <Typography variant="body2" color="textSecondary">
                Drag & drop a new image here, or click to select
              </Typography>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose}>Cancel</Button>
          <Button
            onClick={handleUpdateImage}
            variant="contained"
            color="primary"
            disabled={!newImagePreview || updating}
          >
            {updating ? "Updating..." : "Update Image"}
          </Button>
        </DialogActions>
      </Dialog>
      {/* Add Image Dialog (Desktop) */}
      <Dialog
        open={addDialogOpen}
        onClose={handleAddDialogClose}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>Add Slide Image</DialogTitle>
        <DialogContent>
          <Box
            onDrop={handleAddDrop}
            onDragOver={handleAddDragOver}
            sx={{
              border: "2px dashed #aaa",
              borderRadius: 6,
              p: 2,
              textAlign: "center",
              mb: 2,
              background: "#fafafa",
              cursor: "pointer",
            }}
            onClick={() => document.getElementById("add-file-input").click()}
          >
            <input
              id="add-file-input"
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              onChange={handleAddFileChange}
            />
            {addImagePreview ? (
              <img
                src={addImagePreview}
                alt="preview"
                style={{
                  width: 180,
                  height: 120,
                  objectFit: "cover",
                  borderRadius: 6,
                  border: "1px solid #eee",
                }}
              />
            ) : (
              <Typography variant="body2" color="textSecondary">
                Drag & drop a new image here, or click to select
              </Typography>
            )}
            {/* Desktop recommended size */}
            <Box sx={{ mt: 1 }}>
              <Typography variant="caption" color="textSecondary">
                Recommended size (Desktop): <b>1920 x 600 px</b>
              </Typography>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleAddDialogClose}>Cancel</Button>
          <Button
            onClick={handleAddImage}
            variant="contained"
            color="primary"
            disabled={!addImagePreview || adding}
          >
            {adding ? "Uploading..." : "Upload Image"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default DataEntry;
