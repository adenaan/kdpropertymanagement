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
      {property.images && property.images.length > 0 && (
        <div>
          {property.images.map(({ image }, i) => (
            <img
              key={i}
              src={image}
              alt={`Image ${i + 1} of ${property.title}`}
              style={{ maxWidth: '300px' }}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export async function getStaticPaths() {
  const propertiesDir = path.join(process.cwd(), 'content', 'properties')
  const filenames = fs.readdirSync(propertiesDir)

  const paths = filenames.reduce((acc, filename) => {
    const filePath = path.join(propertiesDir, filename)
    const fileContents = fs.readFileSync(filePath, 'utf8')
    try {
      const data = JSON.parse(fileContents)
      const slug = data.slug ? slugify(data.slug) : slugify(data.title)
      acc.push({
        params: { slug },
      })
    } catch (error) {
      console.error(`Error parsing JSON in file ${filename}:`, error)
      // Skip this file in paths
    }
    return acc
  }, [])

  return {
    paths,
    fallback: true,
  }
}

export async function getStaticProps({ params }) {
  const { slug } = params
  const propertiesDir = path.join(process.cwd(), 'content', 'properties')
  const filenames = fs.readdirSync(propertiesDir)

  let matchedFile = null

  for (const filename of filenames) {
    const filePath = path.join(propertiesDir, filename)
    const fileContents = fs.readFileSync(filePath, 'utf8')
    try {
      const data = JSON.parse(fileContents)
      const fileSlug = data.slug ? slugify(data.slug) : slugify(data.title)
      if (fileSlug === slug) {
        matchedFile = filename
        break
      }
    } catch (error) {
      console.error(`Error parsing JSON in file ${filename}:`, error)
      // skip bad file
    }
  }

  if (!matchedFile) {
    return {
      notFound: true,
    }
  }

  try {
    const filePath = path.join(propertiesDir, matchedFile)
    const fileContents = fs.readFileSync(filePath, 'utf8')
    const property = JSON.parse(fileContents)
    return {
      props: { property },
    }
  } catch (error) {
    console.error(`Error parsing JSON in matched file ${matchedFile}:`, error)
    return { notFound: true }
  }
}
