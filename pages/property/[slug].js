// pages/property/[slug].js
import fs from 'fs'
import path from 'path'
import { slugify } from '../../lib/slugify'

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
    fallback: false
  }
}

export async function getStaticProps({ params }) {
  const { slug } = params
  const propertiesDir = path.join(process.cwd(), 'content', 'properties')
  const filenames = fs.readdirSync(propertiesDir)

  let propertyFile = null

  for (const filename of filenames) {
    const filePath = path.join(propertiesDir, filename)
    const fileContents = fs.readFileSync(filePath, 'utf8')
    const data = JSON.parse(fileContents)
    const fileSlug = data.slug ? slugify(data.slug) : slugify(data.title)

    if (fileSlug === slug) {
      propertyFile = filename
      break
    }
  }

  if (!propertyFile) {
    return { notFound: true }
  }

  const filePath = path.join(propertiesDir, propertyFile)
  const fileContents = fs.readFileSync(filePath, 'utf8')
  const property = JSON.parse(fileContents)

  return {
    props: { property }
  }
}

export default function Property({ property }) {
  if (!property) return <div>Property not found.</div>

  return (
    <div>
      <h1>{property.title}</h1>
      <p>{property.description}</p>
    </div>
  )
}
