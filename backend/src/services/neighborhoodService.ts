import {
  getAllNeighborhoods,
  getNeighborhoodById,
  createNeighborhood as createNeighborhoodRepository,
  updateNeighborhood as updateNeighborhoodRepository,
  deleteNeighborhood as deleteNeighborhoodRepository
} from "../repositories/neighborhoodRepository";

export async function getNeighborhoods() {
  const neighborhoods = await getAllNeighborhoods();

  return neighborhoods;
}

export async function getNeighborhood(id: number) {
  const neighborhood = await getNeighborhoodById(id);

  return neighborhood;
}

export async function createNeighborhood(
  name: string,
  postcode: string,
  city: string
) {
  const neighborhood = await createNeighborhoodRepository(
    name,
    postcode,
    city
  );

  return neighborhood;
}

export async function updateNeighborhood(
  id: number,
  name: string,
  postcode: string,
  city: string
) {
  const neighborhood = await updateNeighborhoodRepository(
    id,
    name,
    postcode,
    city
  );

  return neighborhood;
}

export async function deleteNeighborhood(id: number) {
  const neighborhood = await deleteNeighborhoodRepository(id);

  return neighborhood;
}