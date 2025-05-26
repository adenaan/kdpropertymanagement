import fs from 'fs'
import path from 'path'
import { useRouter } from 'next/router'
import { slugify } from '../../lib/slugify'
import Image from 'next/image'

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

      {Array.isArray(property.images) && property.images.length > 0 && (
        <div>
          {property.images.map(({ image }, i) => (
            // Using next/image for optimization; fallback to img if you prefer
            <Image
              key={i}
              src={image}
              alt={`Image ${i + 1} of ${property.title}`}
              width={300}
              height={200}
              style={{ objectFit: 'cover' }}
              priority={i === 0} // optional: prioritize first image
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
    try {
      const filePath = path.join(propertiesDir, filename)
      const fileContents = fs.readFileSync(filePath, 'utf8')
      const data = JSON.parse(fileContents)
      const slug = data.slug ? slugify(data.slug) : slugify(data.title)

      acc.push({ params: { slug } })
    } catch (error) {
      console.error(`Error parsing JSON in file ${filename}:`, error)
      // Skip invalid JSON files
    }
    return acc
  }, [])

  return {
    paths,
    fallback: true, // fallback true for incremental builds
  }
}

export async function getStaticProps({ params }) {
  const { slug } = params
  const propertiesDir = path.join(process.cwd(), 'content', 'properties')
  const filenames = fs.readdirSync(propertiesDir)

  let matchedFile = null

  for (const filename of filenames) {
    try {
      const filePath = path.join(propertiesDir, filename)
      const fileContents = fs.readFileSync(filePath, 'utf8')
      const data = JSON.parse(fileContents)
      const fileSlug = data.slug ? slugify(data.slug) : slugify(data.title)

      if (fileSlug === slug) {
        matchedFile = filename
        break
      }
    } catch (error) {
      console.error(`Error parsing JSON in file ${filename}:`, error)
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
      // optional: revalidate to enable ISR
      // revalidate: 60,
    }
  } catch (error) {
    console.error(`Error parsing JSON in matched file ${matchedFile}:`, error)
    return {
      notFound: true,
    }
  }
}
