import fs from 'fs'
import path from 'path'
import { slugify } from '../lib/slugify'
import Link from 'next/link'

export async function getStaticProps() {
  const propertiesDir = path.join(process.cwd(), 'content', 'properties')
  const filenames = fs.readdirSync(propertiesDir)
  const properties = filenames.map(filename => {
    const filePath = path.join(propertiesDir, filename)
    const fileContents = fs.readFileSync(filePath, 'utf8')
    return JSON.parse(fileContents)
  })

  return {
    props: { properties }
  }
}

export default function Home({ properties }) {
  return (
    <div>
      <h1>Properties</h1>
      <ul>
        {properties.map(property => {
          const slug = property.slug ? slugify(property.slug) : slugify(property.title)
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
