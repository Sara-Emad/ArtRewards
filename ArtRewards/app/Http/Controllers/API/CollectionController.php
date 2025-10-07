<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Http\Requests\AddArtworksRequest;
use App\Http\Requests\StoreCollectionRequest;
use App\Http\Requests\UpdateCollectionRequest;
use App\Models\Artwork;
use App\Models\Collection;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CollectionController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $search = (string) $request->query('search', '');
        $sort = (string) $request->query('sort', 'newest');
        $perPage = (int) $request->query('per_page', 6);

        $query = Collection::withCount('artworks')
            ->with(['artist'])
            ->when($search !== '', function ($q) use ($search) {
                $q->where(function ($inner) use ($search) {
                    $inner->where('title', 'like', "%{$search}%")
                          ->orWhere('description', 'like', "%{$search}%");
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
            case 'most-artworks':
                $query->orderByDesc('artworks_count');
                break;
            case 'least-artworks':
                $query->orderBy('artworks_count');
                break;
            default:
                $query->latest();
        }

        $collections = $query->paginate($perPage);

        return response()->json($collections);
    }

    public function store(StoreCollectionRequest $request): JsonResponse
    {
        $data = $request->validated();
        if ($request->hasFile('cover_image')) {
            $path = $request->file('cover_image')->store('covers', 'public');
            $data['cover_image_url'] = asset('storage/' . $path);
            unset($data['cover_image']);
        }
        $collection = Collection::create($data);
        return response()->json($collection->load('artist'), 201);
    }

    public function show(Collection $collection): JsonResponse
    {
        $collection->load(['artist', 'artworks']);
        return response()->json($collection);
    }

    public function update(UpdateCollectionRequest $request, Collection $collection): JsonResponse
    {
        $data = $request->validated();
        if ($request->hasFile('cover_image')) {
            $path = $request->file('cover_image')->store('covers', 'public');
            $data['cover_image_url'] = asset('storage/' . $path);
            unset($data['cover_image']);
        }
        $collection->update($data);
        return response()->json($collection->refresh()->load(['artist']));
    }

    public function destroy(Collection $collection): JsonResponse
    {
        $collection->delete();
        return response()->json(['message' => 'Collection deleted']);
    }

    public function addArtworks(AddArtworksRequest $request, Collection $collection): JsonResponse
    {
        $ids = $request->validated()['artwork_ids'];
        $collection->artworks()->syncWithoutDetaching($ids);
        return response()->json($collection->load('artworks'));
    }

    public function removeArtwork(Collection $collection, Artwork $artwork): JsonResponse
    {
        $collection->artworks()->detach($artwork->id);
        return response()->json(['message' => 'Artwork removed']);
    }
}


