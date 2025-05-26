import fs from 'fs';
import path from 'path';

export async function getStaticProps() {
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
        <div key={property.slug}>
          <h2>{property.title}</h2>
          <p>{property.description}</p>
          <p>Location: {property.location}</p>
          <p>Price per night: ${property.price}</p>
          {/* Add images and links as needed */}
        </div>
      ))}
    </div>
  );
}
