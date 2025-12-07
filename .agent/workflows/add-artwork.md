---
description: Add new artwork to the Kidzart gallery
---

# Add New Artwork Workflow

## Steps to Add Artwork

1. **Prepare the image**
   - Get the artwork image file (PNG, JPG, or WEBP)
   - Recommended size: at least 800x800 pixels

2. **Copy image to public folder**
   ```bash
   cp /path/to/artwork.png public/artwork/
   ```

3. **Add artwork data to mockData.js**
   Open `src/data/mockData.js` and add a new object to the `artworks` array:
   ```javascript
   {
     id: [next available ID],
     title: "Artwork Title",
     artist: "Child's Name",
     age: 5,
     ageGroup: 'preschool',  // toddler, preschool, early-elementary, elementary, tween
     imageUrl: "/artwork/filename.png",
     likes: 0,
     description: "Child's description of their artwork",
     category: "Drawings",  // Drawings, Paintings, Crafts
     medium: 'crayon',  // crayon, markers, watercolor, colored-pencils, digital, mixed-media, finger-paint
     theme: 'animals',  // animals, nature, family, fantasy, space, vehicles, abstract, food, ocean, buildings
     style: 'cartoon',  // realistic, abstract, cartoon, expressionist
     highlight: false   // set to true to feature in Highlights section
   }
   ```

4. **Verify the artwork appears**
   - Refresh http://localhost:3000
   - Scroll to gallery section
   - Use filters to find the new artwork

## Age Group Reference
- `toddler`: 2-3 years
- `preschool`: 4-5 years
- `early-elementary`: 6-7 years
- `elementary`: 8-9 years
- `tween`: 10-12 years

## To Feature Artwork in Highlights
Set `highlight: true` in the artwork object. It will appear in Sebastian's Gallery section (or update the section title in App.jsx).
