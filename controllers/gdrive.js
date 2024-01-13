const express = require('express');
const { google } = require('googleapis');
const { GoogleAuth } = require('google-auth-library');
const keys = require('./cred.json');

async function getImagesFromDrive() {
    const auth = new GoogleAuth({
        credentials: keys,
        scopes: 'https://www.googleapis.com/auth/drive'
    });

    const service = google.drive({ version: 'v3', auth });
    const folderId = '1zf-N1mal78pUgR7rkOX1rRcR-xPjO2T0';

    const response = await service.files.list({
        q: `'${folderId}' in parents and mimeType contains 'image/'`,
        fields: 'files(id, name, webViewLink)'
    });

    return response.data.files;
}

exports.getAllImages = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 6;

        let images = await getImagesFromDrive();

        const totalImages = images.length;
        const totalPages = Math.ceil(totalImages / limit);

        if (limit !== 10) {
            const startIndex = (page - 1) * limit;
            const endIndex = page * limit;
            images = images.slice(startIndex, endIndex);
        }

        const imageLinks = images.map((image) => ({
            key: image.name,
            link: `https://lh3.googleusercontent.com/d/${image.id}`
        }));

        res.status(200).json({
            status: 'success',
            images: imageLinks,
            totalPages: totalPages
        });
    } catch (error) {
        console.error('Error in getAllImages:', error);
        res.status(500).json({
            status: 'error',
            message: 'Internal Server Error'
        });
    }
};
