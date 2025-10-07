<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Artwork;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ArtworkController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $search = (string) $request->query('search', '');
        $sort = (string) $request->query('sort', 'newest');
        $perPage = (int) $request->query('per_page', 6);

        $query = Artwork::query()
            ->when($search !== '', function ($q) use ($search) {
                $q->where(function ($inner) use ($search) {
                    $inner->where('title', 'like', "%{$search}%")
                          ->orWhere('artist_name', 'like', "%{$search}%");
                });
            });

        switch ($sort) {
            case 'oldest':
                $query->oldest();
                break;
            case 'title-asc':
                $query->orderBy('title');
                break;
            case 'title-desc':
                $query->orderByDesc('title');
                break;
            default:
                $query->latest();
        }

        $artworks = $query->paginate($perPage);
        return response()->json($artworks);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'title' => ['required', 'string', 'max:100'],
            'artist_name' => ['required', 'string', 'max:100'],
            'category' => ['nullable', 'string', 'max:100'],
            'price_cents' => ['nullable', 'integer', 'min:0'],
            'image' => ['required_without:image_url', 'image', 'max:5120'],
            'image_url' => ['required_without:image', 'url'],
            'link' => ['nullable', 'url'],
        ]);

        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('artworks', 'public');
            $validated['image_url'] = asset('storage/' . $path);
            unset($validated['image']);
        }

        $artwork = Artwork::create($validated);
        return response()->json($artwork, 201);
    }
}


