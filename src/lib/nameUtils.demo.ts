// Example of how the name utilities work with different player names

import { truncateName, formatNameCompact, formatNameUltraCompact, getInitials } from '../lib/nameUtils'

// Test different name scenarios
const testNames = [
  'Mike Rodriguez',      // Your example from the image
  'Marcus Johnson',      // Your example from the image  
  'Kevin Chang',         // From your mock data
  'Daniel Miller',       // From your mock data
  'Alexandra Thompson',  // Long first name
  'Jean-Baptiste',       // Single name with hyphen
  'Mary Catherine Smith-Johnson', // Very long name
  'Li',                  // Very short name
]

console.log('Name Formatting Examples:')
console.log('='.repeat(80))

testNames.forEach(name => {
  console.log(`Original: "${name}"`)
  console.log(`  Truncated (12): "${truncateName(name, 12)}"`)
  console.log(`  Compact: "${formatNameCompact(name)}"`)
  console.log(`  Ultra Compact (10): "${formatNameUltraCompact(name, 10)}"`)
  console.log(`  Initials: "${getInitials(name)}"`)
  console.log('-'.repeat(40))
})

/*
Expected Output:

Original: "Mike Rodriguez"
  Truncated (12): "Mike Rodriguez"
  Compact: "M. Rodriguez"
  Ultra Compact (10): "M. Rodriguez"
  Initials: "MR"

Original: "Marcus Johnson" 
  Truncated (12): "Marcus Johnson"
  Compact: "M. Johnson"
  Ultra Compact (10): "M. Johnson"
  Initials: "MJ"

Original: "Alexandra Thompson"
  Truncated (12): "Alexandra Th…"
  Compact: "A. Thompson"
  Ultra Compact (10): "A. Thompson"
  Initials: "AT"

Original: "Mary Catherine Smith-Johnson"
  Truncated (12): "Mary Catheri…"
  Compact: "M. Smith-Johnson"
  Ultra Compact (10): "M. Smith-…"
  Initials: "MS"
*/
