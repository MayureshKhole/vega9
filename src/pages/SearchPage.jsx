import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Row,
  Col,
  Form,
  Button,
  Spinner,
  Alert,
  Card,
} from "react-bootstrap";
import config from "../config";

const SearchPage = () => {
  const [query, setQuery] = useState("");
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Fetch images from Pixabay API
  const fetchImages = async () => {
    if (!query.trim()) return;
    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        `https://pixabay.com/api/?key=${
          config.pixabayKey
        }&q=${encodeURIComponent(query)}&image_type=photo`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch images");
      }
      const data = await response.json();
      setImages(data.hits); // Pixabay uses "hits" instead of "results"
      if (data.hits.length === 0) {
        setError("No images found. Try searching for something else.");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Handle the "Add Captions" button click
  const handleAddCaptions = (image) => {
    navigate("/canvasPage", { state: { image } });
  };

  return (
    <Container
      className="search-page mt-5"
      style={{ maxHeight: "80vh", overflowY: "auto" }}
    >
      <h1 className="text-center mb-4">Search Images</h1>

      <Form className="mb-4">
        <Row className="justify-content-center">
          <Col xs={12} md={8} lg={6}>
            <Form.Control
              type="text"
              placeholder="Search for images..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="mb-2"
            />
          </Col>
          <Col xs="auto">
            <Button onClick={fetchImages} disabled={loading} variant="primary">
              {loading ? <Spinner animation="border" size="sm" /> : "Search"}
            </Button>
          </Col>
        </Row>
      </Form>

      {error && (
        <Alert variant="danger" className="text-center">
          {error}
        </Alert>
      )}
      {/* 
      {images.length === 0 && !loading && !error && query.trim() && (
        <Alert variant="info" className="text-center">
          No results found. Try searching for something else.
        </Alert>
      )} */}

      <Row className="g-4">
        {images.map((image) => (
          <Col key={image.id} xs={12} sm={6} md={4} lg={3}>
            <Card className="image-card">
              <Card.Img
                variant="top"
                src={image.webformatURL}
                alt={image.tags}
              />
              <Card.Body className="text-center">
                <Button
                  onClick={() => handleAddCaptions(image)}
                  variant="secondary"
                >
                  Add Captions
                </Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default SearchPage;
