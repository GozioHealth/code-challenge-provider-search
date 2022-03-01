# Gozio Physician Search API

#### A candidate coding challenge:
Gozio maintains a database of *physicians* for various healthcare clients. This project was created to surface physician data via a **Location Search API** which ultimately aims to be used both *internally* at Gozio as well as *externally* by clients.

The project is in it's infancy and currently for *internal use only*. The goal of this exercise is to assume ownership of the project, voice any questions or concerns you may have, and help ensure it's success moving forward.

##### Approach
1. Ensure the API is implemented bug-free and in accordance to specification
2. Make any changes you deem necessary to improve upon the codebase
3. Enhance the API to allow **Search By Radius**
4. Ensure all tests are passing

##### Installation
1. Checkout the repo: `hello world`
2. `npm i`
3. `npm test`

##### Location Search API
The Location Search API should exist as a single endpoint `/search` that accepts *optional* parameters used as **Matching Criteria** against each physician:

Optional API Parameters:
```
id: String
latitude: String
longitude: String
streetName: String
streetNumber: String
city: String
state: String
zip: String
```

Example Output (single record):
```
{
    id: 4,
    name: "Bob Smith"
}
```

Example Output (multiple records):
```
[
    { id: 4, name: "Bob Smith" },
    { id: 11, name: "Roberta Smith" }
]
```

##### Matching Criteria
The following rules should be applied to determine a physician match:
1. Match by *id*; if found return a single record
2. Match by *latitude* & *longitude*; if found, add to list of records returned
3. Match by *streetName* & *streetNumber* & *city* & *state* & *zip*. If found, add to list of records returned
4. If no results found, return appropriate status code

##### Physician Data
Physicians may be associated with multiple *practices*; and each practice may have more than one *location*. This relationship is stored within a single mongodb collection named `physician` with the following document stucture:

```
{
    id: 1,
    name: 'Robert Smith'
    practices: [{
        name: 'Rob Smith's Practice',
        locations: [{
            name: 'Piedmont',
            geocode: {
                latitude: 33.8317072,
                longitude: -84.3322364,
                street_name: 'Tullie Rd NE',
                street_number: '1400',
                city: 'Atlanta',
                state: 'GA',
                zipcode: '30329'
            }
        }],
    }]
}
```

##### Search By Radius
Enhance the API to allow an additional *optional* parameter `radius`. When present, the API should:
* Include any additional physician records within the given radius
* Result should always return a list (unless no records found)