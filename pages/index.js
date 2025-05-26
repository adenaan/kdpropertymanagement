import fs from 'fs'
import path from 'path'
import { slugify } from '../lib/slugify'
import Link from 'next/link'

export async function getStaticProps() {
  const fs = require('fs');
  const path = require('path');

  const propertiesDir = path.join(process.cwd(), 'content/properties');
  const filenames = fs.readdirSync(propertiesDir);

  const properties = filenames.map((filename) => {
    const filePath = path.join(propertiesDir, filename);
    const fileContents = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(fileContents);
  });

  return {
    props: {
      properties,
    },
  };
}

export default function Home({ properties }) {
  return (
    <div>
      <h1>Properties Listing</h1>
      {properties.map((property) => (
        <div key={property.slug} style={{ border: '1px solid #ccc', padding: '1rem', marginBottom: '1rem' }}>
          <h2>{property.title}</h2>
          <p><strong>Slug:</strong> {property.slug}</p>
          <p><strong>Location:</strong> {property.location}</p>
          <p><strong>Price per night:</strong> ${property.price}</p>
          <p><strong>Description:</strong> {property.description}</p>

          <p>
            <strong>Airbnb:</strong>{' '}
            <a href={property.airbnbLink} target="_blank" rel="noopener noreferrer">
              {property.airbnbLink}
            </a>
          </p>
          <p>
            <strong>Booking.com:</strong>{' '}
            <a href={property.bookingLink} target="_blank" rel="noopener noreferrer">
              {property.bookingLink}
            </a>
          </p>

          <p><strong>Amenities:</strong></p>
          <ul>
            {property.amenities?.map((amenity, i) => (
              <li key={i}>{amenity}</li>
            ))}
          </ul>

          <p><strong>Images:</strong></p>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            {property.images?.map((imgObj, i) => (
              <img
                key={i}
                src={imgObj.image}
                alt={`${property.title} image ${i + 1}`}
                style={{ maxWidth: '150px', maxHeight: '100px', objectFit: 'cover', borderRadius: '4px' }}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
