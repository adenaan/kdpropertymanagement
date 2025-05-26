import fs from 'fs'
import path from 'path'
import { useRouter } from 'next/router'
import { slugify } from '../../lib/slugify'

export default function PropertyPage({ property }) {
  const router = useRouter()

  if (router.isFallback) {
    return <div>Loading...</div>
  }

  if (!property) {
    return <div>Property not found</div>
  }

  return (
    <div>
      <h1>{property.title}</h1>
      <p>Location: {property.location}</p>
      <p>Price per night: ${property.price}</p>
      <p>{property.description}</p>
      {/* Show images if available */}
      {property.images && property.images.length > 0 && (
        <div>
          {property.images.map(({ image }, i) => (
            <img key={i} src={image} alt={`Image ${i + 1} of ${property.title}`} style={{ maxWidth: '300px' }} />
          ))}
        </div>
      )}
      {/* Add more fields like Airbnb and Booking.com links if needed */}
    </div>
  )
}

export async function getStaticPaths() {
  const propertiesDir = path.join(process.cwd(), 'content', 'properties')
  const filenames = fs.readdirSync(propertiesDir)

  const paths = filenames.map((filename) => {
    const filePath = path.join(propertiesDir, filename)
    const fileContents = fs.readFileSync(filePath, 'utf8')
    const data = JSON.parse(fileContents)
    const slug = data.slug ? slugify(data.slug) : slugify(data.title)

    return {
      params: { slug },
    }
  })

  return {
    paths,
    fallback: true, // or false if you want 404 on unknown
  }
}

export async function getStaticProps({ params }) {
  const { slug } = params
  const propertiesDir = path.join(process.cwd(), 'content', 'properties')
  const filenames = fs.readdirSync(propertiesDir)

  // Find file matching slug by slugifying file contents
  const matchedFile = filenames.find((filename) => {
    const filePath = path.join(propertiesDir, filename)
    const fileContents = fs.readFileSync(filePath, 'utf8')
    const data = JSON.parse(fileContents)
    const fileSlug = data.slug ? slugify(data.slug) : slugify(data.title)
    return fileSlug === slug
  })

  if (!matchedFile) {
    return {
      notFound: true,
    }
  }

  const filePath = path.join(propertiesDir, matchedFile)
  const fileContents = fs.readFileSync(filePath, 'utf8')
  const property = JSON.parse(fileContents)

  return {
    props: {
      property,
    },
  }
}
