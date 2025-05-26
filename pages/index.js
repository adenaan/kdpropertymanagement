import fs from 'fs'
import path from 'path'
import Link from 'next/link'
import { slugify } from '../lib/slugify'

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
