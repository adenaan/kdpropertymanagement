import React from "react";

export default function PropertyPage({ property }) {
  return (
    <div>
      <h1>{property.title}</h1>
      <p>{property.description}</p>
      {/* other property details */}
    </div>
  );
}

export async function getStaticPaths() {
  // Generate paths for each property
  return {
    paths: [],
    fallback: false,
  };
}

export async function getStaticProps({ params }) {
  // Fetch property data
  return {
    props: {
      property: {
        title: "Example Property",
        description: "A lovely place to stay.",
      },
    },
  };
}
