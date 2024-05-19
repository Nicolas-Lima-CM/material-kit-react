import { z } from "zod";
import { createApiUrl } from "./apiUrl";
import { toast } from "react-toastify";
import {
  PaymentMethod,
  PriceReference,
  ClientKeys,
  RepresentativeKeys,
  Color,
  FormaPagRep,
  Tissue,
  FormattedSizes,
  Collection,
} from "../types/types";

// Interfaces
interface DataApi<T> {
  apiHandlers: {
    setIsFetching: (value: boolean) => void;
    setData: (data: T[]) => void;
  };
  setErrorLoadingInformation: (value: boolean) => void;
}

interface AuthenticatedDataApi<T> {
  userAuthToken: string;
  apiHandlers: {
    setIsFetching: (value: boolean) => void;
    setData: (data: T[]) => void;
  };
  setErrorLoadingInformation: (value: boolean) => void;
}

interface ClientsFilters {
  de: string;
  ate: string;
  cliente: string;
  representante: string;
}

interface RepresentativesFilters {
  de: string;
  ate: string;
  representante: string;
}

interface ProductsFilters {
  de: string;
  ate: string;
}

interface Clients {
  id: number;
  nome: string;
  fantasia: string;
  nome_representante: string;
  endereco: string;
  bairro: string;
  id_representante: string;
  cidade: string;
}

interface Representatives {
  id: number;
  nome: string;
  endereco: string;
  bairro: string;
  cidade: string;
  uf: string;
  cep: string;
  email: string;
  telefone1: string;
  telefone2: string;
  telefone3: string;
  cpf: string;
  identidade: string;
  situacao: number;
  comissao: number;
  meta: number;
  observacao: string;
  razao: string;
  cnpj: string;
  area: string;
  banco: string;
  agencia: string;
  conta: string;
  chavepix: string;
  tipochave: string;
  bloqueado: number;
}

interface Product {
  id: number;
  nome: string;
  altura: number;
  largura: number;
  comprimen: number;
  peso: number;
  barra: string;
  codigo: string;
  descricao: string;
  preco: string;
  quantidade_estoque: string;
  codprod: string;
  lista: number;
}

interface SubmitFormRequest {
  phpEndpoint: string;
  requestBody: Record<string, string>;
  errorToastMessage: string;
}

interface HandleFormSubmit {
  errorToastMessage: string;
  setIsSubmitting: (submitting: boolean) => void;
  submitFunction: () => Promise<unknown>;
}

interface ApiResponse {
  additionalParams?: Record<string, unknown>;
  [key: string]: unknown;
}

export const submitFormRequest = async ({
  phpEndpoint,
  requestBody,
  errorToastMessage,
}: SubmitFormRequest) => {
  const url = createApiUrl(phpEndpoint);
  return fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams(requestBody).toString(),
  })
    .then((response) => response.json())
    .then((result) => {
      if (!result?.success) {
        toast.error(errorToastMessage);
      }
      return result;
    });
};

export const handleFormSubmit = async ({
  errorToastMessage,
  setIsSubmitting,
  submitFunction,
}: HandleFormSubmit) => {
  try {
    setIsSubmitting(true);

    await submitFunction();
  } catch (error) {
    toast.error(errorToastMessage);
  } finally {
    setIsSubmitting(false);
  }
};

export const fetchData = async <T>({
  apiHandlers,
  setErrorLoadingInformation,
  url,
  bodyParams,
  parseData,
}: DataApi<T> & {
  url: string;
  bodyParams: Record<string, string>;
  parseData: (result: ApiResponse) => T[];
}): Promise<void> => {
  const { setIsFetching, setData } = apiHandlers;

  setIsFetching(true);

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams(bodyParams).toString(),
    });

    if (!response.ok) {
      setIsFetching(false);
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    const parsedData = parseData(result);

    setData(parsedData);
  } catch (error) {
    setErrorLoadingInformation(true);
    setData([]);
  } finally {
    setIsFetching(false);
  }
};

export const parseApiResponse = <T>({
  result,
  propertyName,
  hasAdditionalParams,
}: {
  result: ApiResponse;
  propertyName: string;
  hasAdditionalParams?: boolean;
}): T[] => {
  let data: T[] = [];

  if (hasAdditionalParams) {
    if (result.additionalParams) {
      const additionalParams = result.additionalParams;

      if (propertyName in additionalParams) {
        data = additionalParams[propertyName] as T[];
      }
    }
  } else {
    if (propertyName in result) {
      data = result[propertyName] as T[];
    }
  }

  return data;
};

export const getClients = async (
  userAuthToken: string,
  filters: ClientsFilters,
  setIsFetchingClients: (value: boolean) => void,
  setFilteredClients: (clients: Clients[]) => void,
  setClients: (clients: Clients[]) => void,
  setSubmittedWithFilters?: (value: boolean) => void
): Promise<void> => {
  setIsFetchingClients(true);

  try {
    const url = createApiUrl("getClients.php");
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        token: userAuthToken ?? "",
        ...filters,
      }).toString(),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    const { clients, filteredClients, wasFiltered } = result;

    if (setSubmittedWithFilters) {
      setSubmittedWithFilters(wasFiltered);
    }

    setFilteredClients(wasFiltered ? filteredClients ?? [] : clients ?? []);
    setClients(clients ?? []);

    setIsFetchingClients(false);
  } catch (error) {
    toast.error("Ocorreu um erro ao buscar clientes!");
  } finally {
    setIsFetchingClients(false);
  }
};

export const getRepresentatives = async (
  userAuthToken: string,
  setIsFetchingRepresentatives: (value: boolean) => void,
  setRepresentatives: (representatives: Representatives[]) => void,
  filters?: RepresentativesFilters | null,
  setFilteredRepresentatives?: (representatives: Representatives[]) => void,
  setSubmittedWithFilters?: (value: boolean) => void
): Promise<void> => {
  setIsFetchingRepresentatives(true);

  try {
    const url = createApiUrl("getRepresentatives.php");
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        token: userAuthToken ?? "",
        ...filters,
      }).toString(),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    const { representatives, filteredRepresentatives, wasFiltered } = result;

    if (setSubmittedWithFilters) {
      setSubmittedWithFilters(wasFiltered);
    }

    if (setFilteredRepresentatives) {
      setFilteredRepresentatives(
        wasFiltered ? filteredRepresentatives ?? [] : representatives ?? []
      );
    }

    setRepresentatives(representatives ?? []);

    setIsFetchingRepresentatives(false);
  } catch (error) {
    toast.error("Ocorreu um erro ao buscar os representantes!");
  } finally {
    setIsFetchingRepresentatives(false);
  }
};

export const getClient = async (
  userAuthToken: string,
  clientID: string | undefined,
  setIsFetchingClient: (value: boolean) => void,
  setClient: (client: Clients | null) => void,
  navigate: (path: string) => void,
  setValue?: (key: ClientKeys, value: string) => void,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  schema?: z.ZodObject<any>
): Promise<void> => {
  setIsFetchingClient(true);

  try {
    const url = createApiUrl("getClient.php");
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        token: userAuthToken ?? "",
        clientID: clientID ?? "",
      }).toString(),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    const { client } = result;

    if (typeof client === "object" && !Array.isArray(client)) {
      setClient(client ?? null);

      if (schema && setValue) {
        const { id_representante } = client;
        setValue("representative_id", String(id_representante));

        Object.keys(client).forEach((key) => {
          if (key in schema.shape) {
            setValue(key as ClientKeys, String(client[key]));
          }
        });
      }
    } else {
      setClient(null);
    }

    if (!client) {
      toast.error("Ocorreu um erro ao buscar o cliente!");
      navigate("/clientes");
    }
  } catch (error) {
    toast.error("Ocorreu um erro ao buscar o cliente!");
  } finally {
    setIsFetchingClient(false);
  }
};

export const getRepresentative = async (
  userAuthToken: string,
  representativeID: number | null,
  setIsFetchingRepresentative: (value: boolean) => void,
  setRepresentative: (representative: Representatives | null) => void,
  navigate: (path: string) => void,
  setValue?: (key: RepresentativeKeys, value: string) => void,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  schema?: z.ZodObject<any>
): Promise<void> => {
  setIsFetchingRepresentative(true);

  try {
    const url = createApiUrl("getRepresentative.php");
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        token: userAuthToken ?? "",
        representativeID: String(representativeID) ?? "",
        withLoginAttribute: "true",
      }).toString(),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    const { representative } = result;

    if (typeof representative === "object" && !Array.isArray(representative)) {
      setRepresentative(representative ?? null);

      if (setValue && schema) {
        Object.keys(representative).forEach((key) => {
          if (key in schema.shape) {
            setValue(key as RepresentativeKeys, String(representative[key]));
          }
        });
      }
    } else {
      setRepresentative(null);
    }

    setIsFetchingRepresentative(false);

    if (!representative) {
      toast.error("Ocorreu um erro ao buscar o representante!");
      navigate("/representantes");
    }
  } catch (error) {
    toast.error("Ocorreu um erro ao buscar o representante!");
  } finally {
    setIsFetchingRepresentative(false);
  }
};

export const getColors = async (
  userAuthToken: string,
  setIsFetchingColors: (value: boolean) => void,
  setColors: (colors: Color[]) => void,
  setErrorLoadingInformation: (value: boolean) => void
): Promise<void> => {
  setIsFetchingColors(true);

  try {
    const url = createApiUrl("getColors.php");
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        token: userAuthToken ?? "",
      }).toString(),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    let { colors } = result;

    // Sort colors alphabetically by color name
    colors = colors.sort((a: Color, b: Color) => {
      if (a.cor < b.cor) return -1;
      if (a.cor > b.cor) return 1;
      return 0;
    });

    setColors(colors);
  } catch (error) {
    setErrorLoadingInformation(true);
    setColors([]);
  } finally {
    setIsFetchingColors(false);
  }
};

export const getRepresentativePaymentMethods = async ({
  userAuthToken,
  setIsFetching,
  representativeID,
  setData,
  setErrorLoadingInformation,
}: {
  userAuthToken: string;
  setIsFetching: (value: boolean) => void;
  setData: (data: FormaPagRep[]) => void;
  representativeID: number | null;
  setErrorLoadingInformation: (value: boolean) => void;
}): Promise<void> => {
  setIsFetching(true);

  try {
    const url = createApiUrl("getRepresentativePaymentMethods.php");
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        token: userAuthToken ?? "",
        representativeID: representativeID ? String(representativeID) : "",
      }).toString(),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    const { representativePaymentMethods } = result;

    setData(representativePaymentMethods);
  } catch (error) {
    setErrorLoadingInformation(true);
    setData([]);
  } finally {
    setIsFetching(false);
  }
};

export const getPaymentMethods = async ({
  userAuthToken,
  setIsFetchingPaymentMethods,
  setPaymentMethods,
  setErrorLoadingInformation,
}: {
  userAuthToken: string;
  setIsFetchingPaymentMethods: (value: boolean) => void;
  setPaymentMethods: (paymentMethods: PaymentMethod[]) => void;
  setErrorLoadingInformation: (value: boolean) => void;
}): Promise<void> => {
  setIsFetchingPaymentMethods(true);

  try {
    const url = createApiUrl("getPaymentMethods.php");
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        token: userAuthToken ?? "",
      }).toString(),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    const { paymentMethods } = result;

    setPaymentMethods(paymentMethods);
  } catch (error) {
    setErrorLoadingInformation(true);
    setPaymentMethods([]);
  } finally {
    setIsFetchingPaymentMethods(false);
  }
};

export const getTissues = async (
  userAuthToken: string,
  setIsFetchingTissues: (value: boolean) => void,
  setTissues: (tissues: Tissue[]) => void,
  setErrorLoadingInformation: (value: boolean) => void
): Promise<void> => {
  setIsFetchingTissues(true);

  try {
    const url = createApiUrl("getTissues.php");

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        token: userAuthToken ?? "",
      }).toString(),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    const { tissues } = result;

    setTissues(tissues);
  } catch (error) {
    setErrorLoadingInformation(true);
    setTissues([]);
  } finally {
    setIsFetchingTissues(false);
  }
};

export const getSizes = async (
  userAuthToken: string,
  setIsFetchingSizes: (value: boolean) => void,
  setSizes: (sizes: FormattedSizes | null) => void,
  setErrorLoadingInformation: (value: boolean) => void
): Promise<void> => {
  setIsFetchingSizes(true);

  try {
    const url = createApiUrl("getSizes.php");

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        token: userAuthToken ?? "",
      }).toString(),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    const { formattedSizes } = result;

    setSizes(formattedSizes);
  } catch (error) {
    setErrorLoadingInformation(true);
    setSizes(null);
  } finally {
    setIsFetchingSizes(false);
  }
};

export const getCollections = async (
  userAuthToken: string,
  setIsFetchingCollections: (value: boolean) => void,
  setCollections: (collections: Collection[]) => void,
  setErrorLoadingInformation: (value: boolean) => void
): Promise<void> => {
  setIsFetchingCollections(true);

  try {
    const url = createApiUrl("getCollections.php");

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        token: userAuthToken ?? "",
      }).toString(),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    const { collections } = result;

    setCollections(collections);
  } catch (error) {
    setErrorLoadingInformation(true);
    setCollections([]);
  } finally {
    setIsFetchingCollections(false);
  }
};

export const deleteClient = async (
  userAuthToken: string,
  clientID: string,
  setIsDeletingClient: (value: boolean) => void,
  handleGetClients: () => Promise<void>
): Promise<void> => {
  setIsDeletingClient(true);

  try {
    const url = createApiUrl("deleteClient.php");

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        token: userAuthToken ?? "",
        clientID,
      }).toString(),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    const { success } = result;

    if (success) {
      toast.success("Cliente deletado com sucesso!");
    } else {
      toast.error("Ocorreu um erro ao deletar o cliente!");
    }
  } catch (error) {
    toast.error("Ocorreu um erro ao deletar o cliente!");
  } finally {
    setIsDeletingClient(false);
    await handleGetClients();
  }
};

export const deleteRepresentative = async (
  userAuthToken: string,
  representativeID: string,
  setIsDeletingRepresentative: (value: boolean) => void,
  handleGetRepresentatives: () => Promise<void>
): Promise<void> => {
  setIsDeletingRepresentative(true);

  try {
    const url = createApiUrl("deleteRepresentative.php");

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        token: userAuthToken ?? "",
        representativeID,
      }).toString(),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    const { success } = result;

    if (success) {
      toast.success("Representante deletado com sucesso!");
    } else {
      toast.error("Ocorreu um erro ao deletar o representante!");
    }
  } catch (error) {
    toast.error("Ocorreu um erro ao deletar o representante!");
  } finally {
    setIsDeletingRepresentative(false);
    await handleGetRepresentatives();
  }
};

export const getProducts = async (
  userAuthToken: string,
  filters: ProductsFilters,
  setIsFetchingProducts: (value: boolean) => void,
  setGroupedProducts: (
    products: { groupCode: string; products: Product[] }[]
  ) => void,
  setFilteredProducts: (products: Product[]) => void,
  setSubmittedWithFilters?: (value: boolean) => void
): Promise<void> => {
  setIsFetchingProducts(true);

  try {
    const url = createApiUrl("getProducts.php");

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        token: userAuthToken ?? "",
        ...filters,
      }).toString(),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();

    let { products } = result;
    const { filteredProducts, wasFiltered } = result;

    if (setSubmittedWithFilters) {
      setSubmittedWithFilters(wasFiltered);
    }

    if (wasFiltered) {
      products = filteredProducts ?? [];
    }

    const productGroupCodes = products.reduce(
      (accumulator: string[], current: Product) => {
        if (!accumulator.includes(current.codprod.slice(0, 6))) {
          accumulator.push(current.codprod.slice(0, 6));
        }
        return accumulator;
      },
      []
    );

    const groupedProducts = productGroupCodes.map(
      (productGroupCode: string) => {
        const productsByGroupCode = products.filter((product: Product) =>
          product.codprod.startsWith(productGroupCode)
        );

        return {
          groupCode: productGroupCode,
          products: productsByGroupCode,
        };
      }
    );

    setGroupedProducts(groupedProducts);
    setFilteredProducts(products);
  } catch (error) {
    setFilteredProducts([]);
  } finally {
    setIsFetchingProducts(false);
  }
};

export const deleteProduct = async (
  userAuthToken: string,
  productID: string,
  setIsDeletingProduct: (value: boolean) => void,
  getProducts: () => void
): Promise<void> => {
  setIsDeletingProduct(true);

  try {
    const url = createApiUrl("deleteProduct.php");

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        token: userAuthToken ?? "",
        productID,
      }).toString(),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    const { success } = result;

    if (success) {
      toast.success("Produto deletado com sucesso!");
    } else {
      toast.error("Ocorreu um erro ao deletar o produto!");
    }
  } catch (error) {
    toast.error("Ocorreu um erro ao deletar o produto!");
  } finally {
    setIsDeletingProduct(false);
    getProducts();
  }
};

export const getCarriers = async <T>({
  userAuthToken,
  apiHandlers,
  setErrorLoadingInformation,
}: AuthenticatedDataApi<T>): Promise<void> => {
  const url = createApiUrl("getCarriers.php");
  const bodyParams = {
    token: userAuthToken,
  };

  const parseData = (result: ApiResponse): T[] => {
    return parseApiResponse({
      result,
      propertyName: "carriers",
      hasAdditionalParams: true,
    });
  };

  await fetchData({
    apiHandlers,
    setErrorLoadingInformation,
    url,
    bodyParams,
    parseData,
  });
};

export const getPrices = async <T>({
  userAuthToken,
  apiHandlers,
  setPriceReferences,
  setErrorLoadingInformation,
}: AuthenticatedDataApi<T> & {
  setPriceReferences: (priceReferences: PriceReference[]) => void;
}): Promise<void> => {
  const url = createApiUrl("getPrices.php");
  const bodyParams = {
    token: userAuthToken,
  };

  const parseData = (result: ApiResponse): T[] => {
    if (setPriceReferences) {
      const priceReferences: PriceReference[] = parseApiResponse({
        result,
        propertyName: "priceReferences",
        hasAdditionalParams: true,
      });

      setPriceReferences(priceReferences);
    }

    return parseApiResponse({
      result,
      propertyName: "prices",
      hasAdditionalParams: true,
    });
  };

  await fetchData({
    apiHandlers,
    setErrorLoadingInformation,
    url,
    bodyParams,
    parseData,
  });
};

export const getRepresentativePrices = async <T>({
  userAuthToken,
  apiHandlers,
  representativeID,
  setErrorLoadingInformation,
}: AuthenticatedDataApi<T> & {
  representativeID: number | null;
}): Promise<void> => {
  const url = createApiUrl("getRepresentativePrices.php");
  const bodyParams = {
    token: userAuthToken,
    representativeID: String(representativeID ?? ""),
  };

  const parseData = (result: ApiResponse): T[] => {
    return parseApiResponse({
      result,
      propertyName: "representativePrices",
    });
  };

  await fetchData({
    apiHandlers,
    setErrorLoadingInformation,
    url,
    bodyParams,
    parseData,
  });
};
