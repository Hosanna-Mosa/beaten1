import React, { useState } from "react";
import {
  Box,
  Paper,
  Typography,
  Grid,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Alert,
  Tabs,
  Tab,
  Divider,
  Card,
  CardContent,
} from "@mui/material";
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  ContentCopy as CopyIcon,
  Download as DownloadIcon,
  Person as PersonIcon,
  Group as GroupIcon,
  Lock as LockIcon,
} from "@mui/icons-material";
import { useEffect } from "react";

function Promotions() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [openDialog, setOpenDialog] = useState(false);
  const [codeType, setCodeType] = useState("coupon");
  const [couponCategory, setCouponCategory] = useState("personal"); // personal or public
  const [generatedCodes, setGeneratedCodes] = useState([]);
  const [showSuccess, setShowSuccess] = useState(false);
  const [existingCodes, setExistingCodes] = useState([]);
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    const fetchCodes = async () => {
      try {
        const token = localStorage.getItem('admin_token');
        const res = await fetch("http://localhost:5000/api/promotions/", {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        if (!res.ok) throw new Error("Failed to fetch codes");
        const data = await res.json();
        setExistingCodes(data);
      } catch (err) {
        console.error("Error fetching codes:", err);
      }
    };

    fetchCodes();
  }, []);

  // Form states
  const [formData, setFormData] = useState({
    discount: "",
    minPurchase: "",
    validFrom: "",
    validUntil: "",
    usageLimit: "",
    quantity: "1",
    recipientName: "", // For personal coupons
    recipientEmail: "", // For personal coupons
    description: "", // For personal coupons
  });

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setFormData({
      discount: "",
      minPurchase: "",
      validFrom: "",
      validUntil: "",
      usageLimit: "",
      quantity: "1",
      recipientName: "",
      recipientEmail: "",
      description: "",
    });
  };

  const handleFormChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
    setCouponCategory(newValue === 0 ? "personal" : "public");
  };

  const generateCode = async () => {
    // Validate required fields
    if (!formData.discount || !formData.minPurchase || !formData.validFrom || !formData.validUntil || !formData.usageLimit) {
      alert("Please fill in all required fields");
      return;
    }

    // Validate discount range
    if (parseInt(formData.discount) < 1 || parseInt(formData.discount) > 100) {
      alert("Discount must be between 1% and 100%");
      return;
    }

    // Validate date range
    const validFrom = new Date(formData.validFrom);
    const validUntil = new Date(formData.validUntil);
    if (validFrom >= validUntil) {
      alert("Valid From date must be before Valid Until date");
      return;
    }

    const codes = [];
    const quantity = parseInt(formData.quantity);

    for (let i = 0; i < quantity; i++) {
      const code =
        codeType === "coupon" ? generateCouponCode() : generateScratchCode();

      codes.push({
        code,
        type: codeType,
        category: couponCategory,
        discount: parseInt(formData.discount),
        minPurchase: parseInt(formData.minPurchase),
        validFrom: formData.validFrom,
        validUntil: formData.validUntil,
        usageLimit: parseInt(formData.usageLimit),
        usedCount: 0,
        status: "active",
        recipientName: formData.recipientName || "",
        recipientEmail: formData.recipientEmail || "",
        description: formData.description || "",
        isPersonal: couponCategory === "personal",
      });
    }

    try {
      const token = localStorage.getItem('admin_token');
      const res = await fetch("http://localhost:5000/api/promotions/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ codes }),
      });

      if (res.ok) {
        const result = await res.json();
        setGeneratedCodes(codes);
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
        handleCloseDialog();
        
        // Refresh the codes list
        const refreshRes = await fetch("http://localhost:5000/api/promotions/", {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        if (refreshRes.ok) {
          const refreshData = await refreshRes.json();
          setExistingCodes(refreshData);
        }
      } else {
        const errorData = await res.json();
        console.error("Failed to save codes to backend:", errorData);
        alert(errorData.message || "Failed to generate codes. Please try again.");
      }
    } catch (err) {
      console.error("Error while saving codes:", err);
      alert("Error generating codes. Please check your connection.");
    }
  };

  const generateCouponCode = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let code = "";
    for (let i = 0; i < 8; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  };

  const generateScratchCode = () => {
    const chars = "0123456789";
    let code = "";
    for (let i = 0; i < 12; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  };

  const handleCopyCode = (code) => {
    navigator.clipboard.writeText(code);
  };

  const handleDownloadCodes = () => {
    const csvContent = generatedCodes
      .map(
        (code) =>
          `${code.code},${code.type},${code.category},${code.discount}%,${code.minPurchase},${code.validFrom},${code.validUntil},${code.usageLimit},${code.recipientName || 'N/A'},${code.recipientEmail || 'N/A'}`
      )
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${couponCategory}_${codeType}_codes_${
      new Date().toISOString().split("T")[0]
    }.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "success";
      case "expired":
        return "error";
      case "used":
        return "warning";
      default:
        return "default";
    }
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case "personal":
        return "primary";
      case "public":
        return "secondary";
      default:
        return "default";
    }
  };

  const filteredCodes = existingCodes.filter(code => {
    if (activeTab === 0) {
      return code.category === "personal" || code.isPersonal;
    } else {
      return code.category === "public" || !code.isPersonal;
    }
  });

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Promotions & Coupons
      </Typography>

      {/* Success Alert */}
      {showSuccess && (
        <Alert severity="success" sx={{ mb: 2 }}>
          Codes generated successfully!
        </Alert>
      )}

      {/* Tabs for Personal vs Public Coupons */}
      <Paper sx={{ mb: 3 }}>
        <Tabs value={activeTab} onChange={handleTabChange} sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tab 
            icon={<PersonIcon />} 
            label="Personal Coupons" 
            iconPosition="start"
          />
          <Tab 
            icon={<GroupIcon />} 
            label="Public Coupons" 
            iconPosition="start"
          />
        </Tabs>
      </Paper>

      {/* Info Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                <LockIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                Personal Coupons
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Generate exclusive coupons for family members and friends. 
                These codes are private and can be shared directly with recipients.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                <GroupIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                Public Coupons
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Generate general coupons for all users. 
                These codes can be used by any customer on your platform.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Generate Button */}
      <Box sx={{ mb: 3 }}>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleOpenDialog}
          sx={{ mb: 2 }}
        >
          Generate {activeTab === 0 ? "Personal" : "Public"} Coupons
        </Button>
      </Box>

      {/* Codes Table */}
      <Paper>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Code</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Category</TableCell>
                <TableCell>Discount</TableCell>
                <TableCell>Min Purchase</TableCell>
                <TableCell>Valid Until</TableCell>
                <TableCell>Usage</TableCell>
                <TableCell>Status</TableCell>
                {activeTab === 0 && <TableCell>Recipient</TableCell>}
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredCodes
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((code) => (
                  <TableRow key={code._id || code.code}>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                          {code.code}
                        </Typography>
                        <Tooltip title="Copy Code">
                          <IconButton
                            size="small"
                            onClick={() => handleCopyCode(code.code)}
                          >
                            <CopyIcon />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip label={code.type} size="small" />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={code.category || (code.isPersonal ? "Personal" : "Public")} 
                        color={getCategoryColor(code.category || (code.isPersonal ? "personal" : "public"))}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>{code.discount}%</TableCell>
                    <TableCell>₹{code.minPurchase}</TableCell>
                    <TableCell>{new Date(code.validUntil).toLocaleDateString()}</TableCell>
                    <TableCell>
                      {code.usedCount}/{code.usageLimit}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={code.status}
                        color={getStatusColor(code.status)}
                        size="small"
                      />
                    </TableCell>
                    {activeTab === 0 && (
                      <TableCell>
                        {code.recipientName ? (
                          <Box>
                            <Typography variant="body2">{code.recipientName}</Typography>
                            <Typography variant="caption" color="text.secondary">
                              {code.recipientEmail}
                            </Typography>
                          </Box>
                        ) : (
                          <Typography variant="body2" color="text.secondary">
                            Not assigned
                          </Typography>
                        )}
                      </TableCell>
                    )}
                    <TableCell>
                      <Tooltip title="Delete">
                        <IconButton size="small" color="error">
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredCodes.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>

      {/* Generate Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          Generate {activeTab === 0 ? "Personal" : "Public"} Coupons
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Discount Percentage"
                name="discount"
                type="number"
                value={formData.discount}
                onChange={handleFormChange}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Minimum Purchase Amount"
                name="minPurchase"
                type="number"
                value={formData.minPurchase}
                onChange={handleFormChange}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Valid From"
                name="validFrom"
                type="date"
                value={formData.validFrom}
                onChange={handleFormChange}
                required
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Valid Until"
                name="validUntil"
                type="date"
                value={formData.validUntil}
                onChange={handleFormChange}
                required
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Usage Limit"
                name="usageLimit"
                type="number"
                value={formData.usageLimit}
                onChange={handleFormChange}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Quantity"
                name="quantity"
                type="number"
                value={formData.quantity}
                onChange={handleFormChange}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Code Type</InputLabel>
                <Select
                  value={codeType}
                  onChange={(e) => setCodeType(e.target.value)}
                  label="Code Type"
                >
                  <MenuItem value="coupon">Coupon Code</MenuItem>
                  <MenuItem value="scratch">Scratch Card</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {/* Personal Coupon Fields */}
            {activeTab === 0 && (
              <>
                <Grid item xs={12}>
                  <Divider sx={{ my: 2 }}>
                    <Chip label="Recipient Information" />
                  </Divider>
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Recipient Name"
                    name="recipientName"
                    value={formData.recipientName}
                    onChange={handleFormChange}
                    placeholder="e.g., John Doe"
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Recipient Email"
                    name="recipientEmail"
                    type="email"
                    value={formData.recipientEmail}
                    onChange={handleFormChange}
                    placeholder="e.g., john@example.com"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Description"
                    name="description"
                    value={formData.description}
                    onChange={handleFormChange}
                    multiline
                    rows={3}
                    placeholder="e.g., Birthday gift for John"
                  />
                </Grid>
              </>
            )}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={generateCode} variant="contained">
            Generate Codes
          </Button>
        </DialogActions>
      </Dialog>

      {/* Download Button */}
      {generatedCodes.length > 0 && (
        <Box sx={{ mt: 3 }}>
          <Button
            variant="outlined"
            startIcon={<DownloadIcon />}
            onClick={handleDownloadCodes}
          >
            Download Generated Codes
          </Button>
        </Box>
      )}
    </Box>
  );
}

export default Promotions;
