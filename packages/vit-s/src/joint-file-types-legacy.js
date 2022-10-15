import { FileType } from '@vitessce/constants-internal';
import { validateOptions, emptySchema } from './file-options-schemas';
import {
  cellsJsonSchema,
  anndataCellsZarrSchema,
  anndataCellSetsZarrSchema,
  anndataExpressionMatrixZarrSchema,
} from './file-options-schemas-legacy';

export function expandMoleculesJson(fileDef) {
  validateOptions(emptySchema, fileDef.options);
  const baseFileDef = {
    ...fileDef,
    coordinationValues: {
      obsType: fileDef.coordinationValues?.obsType || 'molecule',
    },
  };
  delete baseFileDef.type;
  return [
    {
      ...baseFileDef,
      fileType: FileType.OBS_LOCATIONS_MOLECULES_JSON,
    },
    {
      ...baseFileDef,
      fileType: FileType.OBS_LABELS_MOLECULES_JSON,
    },
  ];
}

export function expandExpressionMatrixZarr(fileDef) {
  validateOptions(emptySchema, fileDef.options);
  const baseFileDef = {
    ...fileDef,
    coordinationValues: {
      obsType: fileDef.coordinationValues?.obsType || 'cell',
      featureType: fileDef.coordinationValues?.featureType || 'gene',
      featureValueType:
        fileDef.coordinationValues?.featureValueType || 'expression',
    },
  };
  delete baseFileDef.type;
  return [
    {
      ...baseFileDef,
      fileType: FileType.OBS_FEATURE_MATRIX_EXPRESSION_MATRIX_ZARR,
    },
  ];
}

export function expandRasterJson(fileDef) {
  // Validation already happens in the RasterJsonLoader.
  const baseFileDef = { ...fileDef };
  delete baseFileDef.type;
  return [
    {
      ...baseFileDef,
      fileType: FileType.IMAGE_RASTER_JSON,
    },
    {
      ...baseFileDef,
      fileType: FileType.OBS_SEGMENTATIONS_RASTER_JSON,
      coordinationValues: {
        obsType: baseFileDef.coordinationValues?.obsType || 'cell',
      },
    },
  ];
}

export function expandRasterOmeZarr(fileDef) {
  validateOptions(emptySchema, fileDef.options);
  const baseFileDef = { ...fileDef };
  delete baseFileDef.type;
  return [
    {
      ...baseFileDef,
      fileType: FileType.IMAGE_OME_ZARR,
    },
  ];
}

export function expandCellSetsJson(fileDef) {
  validateOptions(emptySchema, fileDef.options);
  const baseFileDef = { ...fileDef };
  delete baseFileDef.type;
  return [
    {
      ...baseFileDef,
      fileType: FileType.OBS_SETS_CELL_SETS_JSON,
      coordinationValues: {
        obsType: baseFileDef.coordinationValues?.obsType || 'cell',
      },
    },
  ];
}

export function expandCellsJson(fileDef) {
  validateOptions(cellsJsonSchema, fileDef.options);
  const baseFileDef = {
    ...fileDef,
    coordinationValues: {
      obsType: fileDef.coordinationValues?.obsType || 'cell',
      featureType: fileDef.coordinationValues?.featureType || 'gene',
    },
  };
  delete baseFileDef.type;
  delete baseFileDef.options;
  return [
    {
      ...baseFileDef,
      fileType: FileType.OBS_SEGMENTATIONS_CELLS_JSON,
      coordinationValues: {
        obsType: baseFileDef.coordinationValues.obsType,
      },
    },
    {
      ...baseFileDef,
      fileType: FileType.OBS_LOCATIONS_CELLS_JSON,
      coordinationValues: {
        obsType: baseFileDef.coordinationValues.obsType,
      },
    },
    ...(fileDef.options?.embeddingTypes
      ? fileDef.options.embeddingTypes.map(et => ({
        ...baseFileDef,
        fileType: FileType.OBS_EMBEDDING_CELLS_JSON,
        coordinationValues: {
          obsType: baseFileDef.coordinationValues.obsType,
          embeddingType: et,
        },
      }))
      : []),
    ...(fileDef.options?.obsLabelsTypes
      ? fileDef.options.obsLabelsTypes.map(key => ({
        ...baseFileDef,
        fileType: FileType.OBS_LABELS_CELLS_JSON,
        coordinationValues: {
          obsType: baseFileDef.coordinationValues.obsType,
          obsLabelsType: key,
        },
      }))
      : []),
  ];
}

export function expandClustersJson(fileDef) {
  validateOptions(emptySchema, fileDef.options);
  const baseFileDef = {
    ...fileDef,
    coordinationValues: {
      obsType: fileDef.coordinationValues?.obsType || 'cell',
      featureType: fileDef.coordinationValues?.featureType || 'gene',
      featureValueType:
        fileDef.coordinationValues?.featureValueType || 'expression',
    },
  };
  delete baseFileDef.type;
  return [
    {
      ...baseFileDef,
      fileType: FileType.OBS_FEATURE_MATRIX_CLUSTERS_JSON,
    },
  ];
}

export function expandGenesJson(fileDef) {
  validateOptions(emptySchema, fileDef.options);
  const baseFileDef = {
    ...fileDef,
    coordinationValues: {
      obsType: fileDef.coordinationValues?.obsType || 'cell',
      featureType: fileDef.coordinationValues?.featureType || 'gene',
      featureValueType:
        fileDef.coordinationValues?.featureValueType || 'expression',
    },
  };
  delete baseFileDef.type;
  return [
    {
      ...baseFileDef,
      fileType: FileType.OBS_FEATURE_MATRIX_GENES_JSON,
    },
  ];
}

function getAnndataBaseFileDef(fileDef) {
  return {
    url: fileDef.url,
    requestInit: fileDef.requestInit,
    coordinationValues: {
      ...fileDef.coordinationValues,
      obsType: fileDef.coordinationValues?.obsType || 'cell',
      featureType: fileDef.coordinationValues?.featureType || 'gene',
      featureValueType:
        fileDef.coordinationValues?.featureValueType || 'expression',
    },
  };
}

export function expandAnndataCellsZarr(fileDef) {
  validateOptions(anndataCellsZarrSchema, fileDef.options);
  const baseFileDef = getAnndataBaseFileDef(fileDef);
  const { options = {} } = fileDef;
  const embeddingTypes = options.mappings ? Object.keys(options.mappings) : [];
  const obsLabelsTypes = options.factors ? options.factors : [];
  return [
    ...(options.poly
      ? [
        {
          ...baseFileDef,
          fileType: FileType.OBS_SEGMENTATIONS_ANNDATA_ZARR,
          options: {
            path: options.poly,
          },
          coordinationValues: {
            obsType: baseFileDef.coordinationValues.obsType,
          },
        },
      ]
      : []),
    ...(options.xy
      ? [
        {
          ...baseFileDef,
          fileType: FileType.OBS_LOCATIONS_ANNDATA_ZARR,
          options: {
            path: options.xy,
          },
          coordinationValues: {
            obsType: baseFileDef.coordinationValues.obsType,
          },
        },
      ]
      : []),
    ...embeddingTypes.map(et => ({
      ...baseFileDef,
      fileType: FileType.OBS_EMBEDDING_ANNDATA_ZARR,
      options: {
        path: options.mappings[et].key,
        dims: options.mappings[et].dims,
      },
      coordinationValues: {
        obsType: baseFileDef.coordinationValues.obsType,
        embeddingType: et,
      },
    })),
    ...obsLabelsTypes.map(olt => ({
      ...baseFileDef,
      fileType: FileType.OBS_LABELS_ANNDATA_ZARR,
      options: {
        path: olt,
      },
      coordinationValues: {
        obsType: baseFileDef.coordinationValues.obsType,
        obsLabelsType: olt.split('/').at(-1),
      },
    })),
  ];
}

export function expandAnndataCellSetsZarr(fileDef) {
  validateOptions(anndataCellSetsZarrSchema, fileDef.options);
  const baseFileDef = getAnndataBaseFileDef(fileDef);
  const { options = [] } = fileDef;
  return [
    {
      ...baseFileDef,
      fileType: FileType.OBS_SETS_ANNDATA_ZARR,
      options: options.map(option => ({
        name: option.groupName,
        path: option.setName,
        scorePath: option.scoreName,
      })),
      coordinationValues: {
        obsType: baseFileDef.coordinationValues.obsType,
      },
    },
  ];
}

export function expandAnndataExpressionMatrixZarr(fileDef) {
  validateOptions(anndataExpressionMatrixZarrSchema, fileDef.options);
  const baseFileDef = getAnndataBaseFileDef(fileDef);
  const { options = {} } = fileDef;
  return [
    ...(options.geneAlias
      ? [
        {
          ...baseFileDef,
          fileType: FileType.FEATURE_LABELS_ANNDATA_ZARR,
          options: {
            path: options.geneAlias,
          },
          coordinationValues: {
            featureType: baseFileDef.coordinationValues.featureType,
          },
        },
      ]
      : []),
    {
      ...baseFileDef,
      fileType: FileType.OBS_FEATURE_MATRIX_ANNDATA_ZARR,
      options: {
        path: options.matrix,
        featureFilterPath: options.geneFilter,
        initialFeatureFilterPath: options.matrixGeneFilter,
      },
      coordinationValues: {
        obsType: baseFileDef.coordinationValues.obsType,
        featureType: baseFileDef.coordinationValues.featureType,
        featureValueType: baseFileDef.coordinationValues.featureValueType,
      },
    },
  ];
}
