<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\API\CollectionController;
use App\Http\Controllers\API\ArtworkController;

// Simple service/health endpoints (useful for ngrok checks)
Route::get('/', function () {
    return response()->json(['service' => 'ArtRewards API', 'ok' => true]);
});
Route::get('/health', function () {
    return response()->json(['status' => 'ok']);
});

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

// Collections
Route::get('/collections', [CollectionController::class, 'index']);
Route::post('/collections', [CollectionController::class, 'store']);
Route::get('/collections/{collection}', [CollectionController::class, 'show']);
Route::put('/collections/{collection}', [CollectionController::class, 'update']);
Route::delete('/collections/{collection}', [CollectionController::class, 'destroy']);
Route::post('/collections/{collection}/artworks', [CollectionController::class, 'addArtworks']);
Route::delete('/collections/{collection}/artworks/{artwork}', [CollectionController::class, 'removeArtwork']);

// Artworks
Route::get('/artworks', [ArtworkController::class, 'index']);
Route::post('/artworks', [ArtworkController::class, 'store']);


