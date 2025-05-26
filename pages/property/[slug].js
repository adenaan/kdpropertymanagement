import fs from 'fs';
import path from 'path';

export async function getStaticPaths() {
  const propertiesDir = path.join(process.cwd(), 'content/properties');
  const filenames = fs.readdirSync(propertiesDir);

  const paths = filenames.map(filename => {
    const slug = filename.replace(/\.json$/, '');
    return { params: { slug } };
  });

  return { paths, fallback: false };
}

export async function getStaticProps({ params }) {
  const filePath = path.join(process.cwd(), 'content/properties', `${params.slug}.json`);
  const fileContents = fs.readFileSync(filePath, 'utf8');
  const property = JSON.parse(fileContents);

  return {
    props: { property },
  };
}

export default function PropertyPage({ property }) {
  return (
    <div>
      <h1>{property.title}</h1>
      <p>Location: {property.location}</p>
      <p>Price per night: ${property.price}</p>
      <p>{property.description}</p>
      <p>
        <a href={property.airbnbLink} target="_blank" rel="noopener noreferrer">Airbnb</a> |{' '}
        <a href={property.bookingLink} target="_blank" rel="noopener noreferrer">Booking.com</a>
      </p>
      <h3>Amenities</h3>
      <ul>
        {property.amenities.map((amenity, idx) => (
          <li key={idx}>{amenity}</li>
        ))}
      </ul>
      <h3>Images</h3>
      {property.images && property.images.length > 0 ? (
        property.images.map((imgObj, idx) => (
          <img
            key={idx}
            src={imgObj.image}
            alt={`${property.title} image ${idx + 1}`}
            style={{ maxWidth: '400px', marginBottom: '10px' }}
          />
        ))
      ) : (
        <p>No images available</p>
      )}
    </div>
  );
}
