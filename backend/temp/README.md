# Temp Directory

This directory is used for temporary file processing during identity verification.

Files in this directory are automatically cleaned up after processing.

## Structure
- Each verification session gets its own subdirectory: `temp/{sessionId}/`
- Files are stored temporarily during OCR and face processing
- All files are deleted after verification completion

## Security
- Files are encrypted at rest
- No permanent storage of sensitive documents
- Automatic cleanup after 30 minutes max