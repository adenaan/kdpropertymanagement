import fs from 'fs';
import path from 'path';
import Link from 'next/link';

export async function getStaticProps() {
  const propertiesDir = path.join(process.cwd(), 'content/properties');
  const filenames = fs.readdirSync(propertiesDir);

  const properties = filenames.map(filename => {
    const filePath = path.join(propertiesDir, filename);
    const fileContents = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(fileContents);
  });

  return {
    props: { properties },
  };
}

export default function Home({ properties }) {
  return (
    <div>
      <h1>Properties</h1>
      <ul>
        {properties.map((property) => (
          <li key={property.slug}>
            <Link href={`/property/${property.slug}`}>
              <a>
                <h2>{property.title}</h2>
                <p>{property.location}</p>
                <p>Price per night: ${property.price}</p>
                {property.images && property.images.length > 0 && (
                  <img 
                    src={property.images[0].image} 
                    alt={property.title} 
                    style={{ width: '200px', height: 'auto' }} 
                  />
                )}
              </a>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
