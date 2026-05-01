## Summary

This PR updates the Algeria administrative dataset from 58 wilayas to 69 wilayas.

## Changes

- Updated `Wilaya_Of_Algeria.json` to include 69 wilayas.
- Updated `Commune_Of_Algeria.json` to keep 1541 communes mapped to the updated 69-wilaya structure.
- Preserved the existing JSON structure:
  - Wilaya: `id`, `code`, `name`, `ar_name`, `longitude`, `latitude`
  - Commune: `id`, `post_code`, `name`, `wilaya_id`, `ar_name`, `longitude`, `latitude`
- Normalized `wilaya_id` references to match the updated wilaya codes.
- Fixed missing commune coordinates.
- Removed duplicate `post_code` values used as technical identifiers.
