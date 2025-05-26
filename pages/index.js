import fs from 'fs'
iimport Link from 'next/link'
import { slugify } from '../lib/slugify'
import path from 'path'

export default function Property({ property }) {
  return (
    <div>
      <h1>{property.title}</h1>
      <p>{property.description}</p>
      {/* render other property details */}
    </div>
  )
}

export async function getStaticPaths() {
  const propertiesDir = path.join(process.cwd(), 'content', 'properties')
  const filenames = fs.readdirSync(propertiesDir)

  const paths = filenames.map(filename => {
    const filePath = path.join(propertiesDir, filename)
    const fileContents = fs.readFileSync(filePath, 'utf8')
    const data = JSON.parse(fileContents)
    const slug = data.slug ? slugify(data.slug) : slugify(data.title)

    return { params: { slug } }
  })

  return {
    paths,
    fallback: false, // or true/blocking depending on your needs
  }
}

export async function getStaticProps({ params }) {
  const { slug } = params
  const propertiesDir = path.join(process.cwd(), 'content', 'properties')
  const filenames = fs.readdirSync(propertiesDir)

  const propertyFile = filenames.find(filename => {
    const filePath = path.join(propertiesDir, filename)
    const fileContents = fs.readFileSync(filePath, 'utf8')
    const data = JSON.parse(fileContents)
    const fileSlug = data.slug ? slugify(data.slug) : slugify(data.title)
    return fileSlug === slug
  })

  if (!propertyFile) {
    return {
      notFound: true,
    }
  }

  const filePath = path.join(propertiesDir, propertyFile)
  const fileContents = fs.readFileSync(filePath, 'utf8')
  const property = JSON.parse(fileContents)

  return {
    props: { property },
  }
}


export default function Home({ properties }) {
  return (
    <div>
      <h1>Properties</h1>
      <ul>
        {properties.map((property) => {
          const slug = property.slug ? slugify(property.slug) : slugify(property.title);
          return (
            <li key={slug}>
              <Link href={`/property/${slug}`}>
                <a>{property.title}</a>
              </Link>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

export async function getStaticProps() {
  const propertiesDir = path.join(process.cwd(), 'content', 'properties')
  const filenames = fs.readdirSync(propertiesDir)

  const properties = filenames.map((filename) => {
    const filePath = path.join(propertiesDir, filename)
    const fileContents = fs.readFileSync(filePath, 'utf8')
    const data = JSON.parse(fileContents)

    // Add sanitized slug here to pass to props (optional)
    const slug = data.slug ? slugify(data.slug) : slugify(data.title)
    return {
      ...data,
      slug,
    }
  })

  return {
    props: {
      properties,
    },
  }
}
