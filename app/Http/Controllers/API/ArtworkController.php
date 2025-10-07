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
}


