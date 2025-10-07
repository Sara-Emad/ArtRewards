<?php

namespace App\Http\Controllers\API;

use OpenApi\Annotations as OA;

/**
 * @OA\Info(
 *   version="1.0.0",
 *   title="ArtRewards API",
 *   description="Backend API for artist collections and artworks."
 * )
 *
 * @OA\Server(
 *   url="/api",
 *   description="API base path"
 * )
 *
 * @OA\Tag(
 *   name="Collections",
 *   description="Manage collections and their artworks"
 * )
 * @OA\Tag(
 *   name="Artworks",
 *   description="List and search artworks"
 * )
 *
 *
 */
class SwaggerDocs
{

    /**
     * Collections: list
     *
     * @OA\Get(
     *   path="/collections",
     *   tags={"Collections"},
     *   summary="List collections with search/sort/pagination",
     *   @OA\Parameter(name="search", in="query", required=false, @OA\Schema(type="string")),
     *   @OA\Parameter(name="sort", in="query", required=false, @OA\Schema(type="string", enum={"newest","oldest","title-asc","title-desc","most-artworks","least-artworks"})),
     *   @OA\Parameter(name="page", in="query", required=false, @OA\Schema(type="integer", minimum=1)),
     *   @OA\Parameter(name="per_page", in="query", required=false, @OA\Schema(type="integer", minimum=1, default=6)),
     *   @OA\Response(response=200, description="OK")
     * )
     */
    public function listCollections(): void {}

    /**
     * Collections: create
     *
     * @OA\Post(
     *   path="/collections",
     *   tags={"Collections"},
     *   summary="Create a collection",
     *   @OA\RequestBody(
     *     required=true,
     *     @OA\JsonContent(required={"artist_id","title","description","cover_image_url"},
     *       @OA\Property(property="artist_id", type="integer", example=1),
     *       @OA\Property(property="title", type="string", example="My Collection"),
     *       @OA\Property(property="description", type="string", example="Short description"),
     *       @OA\Property(property="cover_image_url", type="string", example="https://picsum.photos/seed/cover/600/400")
     *     )
     *   ),
     *   @OA\Response(response=201, description="Created"),
     *   @OA\Response(response=422, description="Validation error")
     * )
     */
    public function createCollection(): void {}

    /**
     * Collections: show
     *
     * @OA\Get(
     *   path="/collections/{id}",
     *   tags={"Collections"},
     *   summary="Get a collection by ID",
     *   @OA\Parameter(name="id", in="path", required=true, @OA\Schema(type="integer")),
     *   @OA\Response(response=200, description="OK"),
     *   @OA\Response(response=404, description="Not found")
     * )
     */
    public function showCollection(): void {}

    /**
     * Collections: update
     *
     * @OA\Put(
     *   path="/collections/{id}",
     *   tags={"Collections"},
     *   summary="Update a collection",
     *   @OA\Parameter(name="id", in="path", required=true, @OA\Schema(type="integer")),
     *   @OA\RequestBody(
     *     required=true,
     *     @OA\JsonContent(
     *       @OA\Property(property="title", type="string", example="Updated title"),
     *       @OA\Property(property="description", type="string", example="Updated description"),
     *       @OA\Property(property="cover_image_url", type="string", example="https://picsum.photos/seed/newcover/600/400")
     *     )
     *   ),
     *   @OA\Response(response=200, description="OK"),
     *   @OA\Response(response=422, description="Validation error")
     * )
     */
    public function updateCollection(): void {}

    /**
     * Collections: delete
     *
     * @OA\Delete(
     *   path="/collections/{id}",
     *   tags={"Collections"},
     *   summary="Delete a collection",
     *   @OA\Parameter(name="id", in="path", required=true, @OA\Schema(type="integer")),
     *   @OA\Response(response=200, description="Deleted")
     * )
     */
    public function deleteCollection(): void {}

    /**
     * Collections: add artworks
     *
     * @OA\Post(
     *   path="/collections/{id}/artworks",
     *   tags={"Collections"},
     *   summary="Add artworks to a collection",
     *   @OA\Parameter(name="id", in="path", required=true, @OA\Schema(type="integer")),
     *   @OA\RequestBody(
     *     required=true,
     *     @OA\JsonContent(required={"artwork_ids"},
     *       @OA\Property(property="artwork_ids", type="array", @OA\Items(type="integer"), example={1,2,3})
     *     )
     *   ),
     *   @OA\Response(response=200, description="OK"),
     *   @OA\Response(response=422, description="Validation error")
     * )
     */
    public function addArtworksToCollection(): void {}

    /**
     * Collections: remove artwork
     *
     * @OA\Delete(
     *   path="/collections/{id}/artworks/{artworkId}",
     *   tags={"Collections"},
     *   summary="Remove an artwork from a collection",
     *   @OA\Parameter(name="id", in="path", required=true, @OA\Schema(type="integer")),
     *   @OA\Parameter(name="artworkId", in="path", required=true, @OA\Schema(type="integer")),
     *   @OA\Response(response=200, description="Removed")
     * )
     */
    public function removeArtworkFromCollection(): void {}

    /**
     * Artworks: list
     *
     * @OA\Get(
     *   path="/artworks",
     *   tags={"Artworks"},
     *   summary="List artworks with search/sort/pagination",
     *   @OA\Parameter(name="search", in="query", required=false, @OA\Schema(type="string")),
     *   @OA\Parameter(name="sort", in="query", required=false, @OA\Schema(type="string", enum={"newest","oldest","title-asc","title-desc"})),
     *   @OA\Parameter(name="page", in="query", required=false, @OA\Schema(type="integer", minimum=1)),
     *   @OA\Parameter(name="per_page", in="query", required=false, @OA\Schema(type="integer", minimum=1, default=6)),
     *   @OA\Response(response=200, description="OK")
     * )
     */
    public function listArtworks(): void {}
}


