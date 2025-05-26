// pages/property/[slug].js

import fs from 'fs';
import path from 'path';
import Head from 'next/head';

// Helper to sanitize slugs consistently (no spaces, all lowercase, dashes)
const sanitizeSlug = (str) =>
  str.toLowerCase().replace(/\s+/g, '-');

export async function getStaticPaths() {
  const propertiesDir = path.join(process.cwd(), 'content/properties');
  const filenames = fs.readdirSync(propertiesDir);

  const paths = filenames.map((filename) => {
    const rawSlug = filename.replace(/\.json$/, '');
    const slug = sanitizeSlug(rawSlug);
    return { params: { slug } };
  });

  return { paths, fallback: false };
}

export async function getStaticProps({ params }) {
  const propertiesDir = path.join(process.cwd(), 'content/properties');

  // Find the file matching sanitized slug
  const filenames = fs.readdirSync(propertiesDir);
  const file = filenames.find((filename) => {
    return sanitizeSlug(filename.replace(/\.json$/, '')) === params.slug;
  });

  if (!file) {
    return { notFound: true };
  }

  const filePath = path.join(propertiesDir, file);
  const propertyData = JSON.parse(fs.readFileSync(filePath, 'utf8'));

  return {
    props: {
      property: propertyData,
    },
  };
}

export default function PropertyPage({ property }) {
  if (!property) return <div>Property not found</div>;

  return (
    <>
      <Head>
        <title>{property.title}</title>
      </Head>
      <main>
        <h1>{property.title}</h1>
        <p><strong>Location:</strong> {property.location}</p>
        <p><strong>Price per night:</strong> ${property.price}</p>
        <p>{property.description}</p>
        <p>
          <a href={property.airbnbLink} target="_blank" rel="noopener noreferrer">
            Airbnb Listing
          </a>
          {' | '}
          <a href={property.bookingLink} target="_blank" rel="noopener noreferrer">
            Booking.com Listing
          </a>
        </p>
        <h3>Amenities</h3>
        <ul>
          {property.amenities && property.amenities.map((item, idx) => (
            <li key={idx}>{item}</li>
          ))}
        </ul>
        <h3>Images</h3>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          {property.images && property.images.length > 0 ? (
            property.images.map(({ image }, idx) => (
              <img
                key={idx}
                src={image}
                alt={`${property.title} image ${idx + 1}`}
                style={{ maxWidth: '200px', borderRadius: '8px' }}
              />
            ))
          ) : (
            <p>No images available.</p>
          )}
        </div>
      </main>
    </>
  );
}
