import React, { useEffect, useMemo, useCallback } from 'react';
import TitleInfo from '../TitleInfo';
import { capitalize } from '../../utils';
import {
  useDeckCanvasSize, useReady, useUrls, useExpressionValueGetter,
} from '../hooks';
import { setCellSelection, mergeCellSets, canLoadResolution } from '../utils';
import {
  useObsLocationsData,
  useObsSegmentationsData,
  useObsSetsData,
  useFeatureSelection,
  useImageData,
  useObsFeatureMatrixIndices,
  useNeighborhoodsData,
  useMoleculesData, // TODO: remove
} from '../data-hooks';
import { getCellColors } from '../interpolate-colors';
import Spatial from './Spatial';
import SpatialOptions from './SpatialOptions';
import SpatialTooltipSubscriber from './SpatialTooltipSubscriber';
import { makeSpatialSubtitle, getInitialSpatialTargets } from './utils';
import {
  useCoordination,
  useLoaders,
  useSetComponentHover,
  useSetComponentViewInfo,
  useAuxiliaryCoordination,
} from '../../app/state/hooks';
import { COMPONENT_COORDINATION_TYPES } from '../../app/state/coordination';
import { DataType } from '../../app/constants';
import { useHasLoader } from '../data-hook-utils';

const SPATIAL_DATA_TYPES = [
  'molecules', // TODO: remove
  DataType.IMAGE,
  DataType.OBS_LOCATIONS, DataType.OBS_SEGMENTATIONS,
  DataType.OBS_SETS, DataType.OBS_FEATURE_MATRIX,
];

/**
 * A subscriber component for the spatial plot.
 * @param {object} props
 * @param {string} props.theme The current theme name.
 * @param {object} props.coordinationScopes The mapping from coordination types to coordination
 * scopes.
 * @param {function} props.removeGridComponent The callback function to pass to TitleInfo,
 * to call when the component has been removed from the grid.
 * @param {string} props.title The component title.
 */
export default function SpatialSubscriber(props) {
  const {
    uuid,
    coordinationScopes,
    removeGridComponent,
    observationsLabelOverride: observationsLabel = 'cell',
    observationsPluralLabelOverride: observationsPluralLabel = `${observationsLabel}s`,
    subobservationsLabelOverride: subobservationsLabel = 'molecule',
    subobservationsPluralLabelOverride: subobservationsPluralLabel = `${subobservationsLabel}s`,
    theme,
    disableTooltip = false,
    title = 'Spatial',
    disable3d,
    globalDisable3d,
  } = props;

  const loaders = useLoaders();
  const setComponentHover = useSetComponentHover();
  const setComponentViewInfo = useSetComponentViewInfo(uuid);

  // Get "props" from the coordination space.
  const [{
    dataset,
    obsType,
    featureType,
    featureValueType,
    spatialZoom: zoom,
    spatialTargetX: targetX,
    spatialTargetY: targetY,
    spatialTargetZ: targetZ,
    spatialRotationX: rotationX,
    spatialRotationY: rotationY,
    spatialRotationZ: rotationZ,
    spatialRotationOrbit: rotationOrbit,
    spatialOrbitAxis: orbitAxis,
    spatialImageLayer: rasterLayers,
    spatialSegmentationLayer: cellsLayer,
    spatialPointLayer: moleculesLayer,
    spatialNeighborhoodLayer: neighborhoodsLayer,
    obsFilter: cellFilter,
    obsHighlight: cellHighlight,
    featureSelection: geneSelection,
    obsSetSelection: cellSetSelection,
    obsSetColor: cellSetColor,
    obsColorEncoding: cellColorEncoding,
    additionalObsSets: additionalCellSets,
    spatialAxisFixed,
    featureValueColormap: geneExpressionColormap,
    featureValueColormapRange: geneExpressionColormapRange,
  }, {
    setSpatialZoom: setZoom,
    setSpatialTargetX: setTargetX,
    setSpatialTargetY: setTargetY,
    setSpatialTargetZ: setTargetZ,
    setSpatialRotationX: setRotationX,
    setSpatialRotationOrbit: setRotationOrbit,
    setSpatialOrbitAxis: setOrbitAxis,
    setSpatialImageLayer: setRasterLayers,
    setSpatialSegmentationLayer: setCellsLayer,
    setSpatialPointLayer: setMoleculesLayer,
    setSpatialNeighborhoodLayer: setNeighborhoodsLayer,
    setObsFilter: setCellFilter,
    setObsSetSelection: setCellSetSelection,
    setObsHighlight: setCellHighlight,
    setObsSetColor: setCellSetColor,
    setObsColorEncoding: setCellColorEncoding,
    setAdditionalObsSets: setAdditionalCellSets,
    setMoleculeHighlight,
    setSpatialAxisFixed,
    setFeatureValueColormap: setGeneExpressionColormap,
    setFeatureValueColormapRange: setGeneExpressionColormapRange,
  }] = useCoordination(COMPONENT_COORDINATION_TYPES.spatial, coordinationScopes);

  const [
    {
      rasterLayersCallbacks,
    },
  ] = useAuxiliaryCoordination(
    COMPONENT_COORDINATION_TYPES.layerController,
    coordinationScopes,
  );

  const use3d = rasterLayers?.some(l => l.use3d);

  const [urls, addUrl, resetUrls] = useUrls();
  const [
    isReady,
    setItemIsReady,
    setItemIsNotReady,
    resetReadyItems,
  ] = useReady(
    SPATIAL_DATA_TYPES,
  );
  const [width, height, deckRef] = useDeckCanvasSize();

  // Reset file URLs and loader progress when the dataset has changed.
  // Also clear the array of automatically-initialized layers.
  useEffect(() => {
    resetUrls();
    resetReadyItems();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loaders, dataset]);

  const hasExpressionData = useHasLoader(loaders, dataset, DataType.OBS_FEATURE_MATRIX, { obsType, featureType, featureValueType });
  const hasCellsData = useHasLoader(loaders, dataset, DataType.OBS_SEGMENTATIONS, { obsType });
  const hasImageData = useHasLoader(loaders, dataset, DataType.IMAGE, {});
  // Get data from loaders using the data hooks.
  const {
    obsIndex: obsLocationsIndex,
    obsLocations,
  } = useObsLocationsData(
    loaders, dataset, setItemIsReady, addUrl, false,
    { setSpatialPointLayer: setMoleculesLayer },
    { spatialPointLayer: moleculesLayer },
    {}, // TODO: use obsType once #1240 is merged.
  );
  const {
    obsIndex: obsSegmentationsIndex,
    obsSegmentations,
    obsSegmentationsType,
  } = useObsSegmentationsData(
    loaders, dataset, setItemIsReady, addUrl, false,
    { setSpatialSegmentationLayer: setCellsLayer },
    { spatialSegmentationLayer: cellsLayer },
    {}, // TODO: use obsType once #1240 is merged.
  );
  const { obsSets: cellSets } = useObsSetsData(
    loaders, dataset, setItemIsReady, addUrl, false,
    { setObsSetSelection: setCellSetSelection, setObsSetColor: setCellSetColor },
    { obsSetSelection: cellSetSelection, obsSetColor: cellSetColor },
    { obsType },
  );
  const [expressionData] = useFeatureSelection(
    loaders, dataset, setItemIsReady, false, geneSelection, setItemIsNotReady,
    { obsType, featureType, featureValueType },
  );
  const { obsIndex } = useObsFeatureMatrixIndices(
    loaders, dataset, setItemIsReady, addUrl, false,
    { obsType, featureType, featureValueType },
  );
  // eslint-disable-next-line no-unused-vars
  const [raster, imageLayerLoaders, imageLayerMeta] = useImageData(
    loaders, dataset, setItemIsReady, addUrl, false,
    { setSpatialImageLayer: setRasterLayers },
    { spatialImageLayer: rasterLayers },
    {}, // TODO: which properties to match on
  );
  const [neighborhoods] = useNeighborhoodsData(
    loaders, dataset, setItemIsReady, addUrl, false,
    { setSpatialNeighborhoodLayer: setNeighborhoodsLayer },
    { spatialNeighborhoodLayer: neighborhoodsLayer },
  );

  // TODO: remove useMoleculesData
  const [molecules, moleculesCount, locationsCount] = useMoleculesData(
    loaders, dataset, setItemIsReady, addUrl, false, {}, {},
  );

  const layers = useMemo(() => {
    // Only want to pass in cells layer once if there is not `bitmask`.
    // We pass in the cells data regardless because it is needed for selection,
    // but the rendering layer itself is not needed.
    const canPassInCellsLayer = obsSegmentationsType === 'polygon';
    return [
      ...(moleculesLayer ? [{ ...moleculesLayer, type: 'molecules' }] : []),
      ...((cellsLayer && canPassInCellsLayer) ? [{ ...cellsLayer, type: 'cells' }] : []),
      ...(neighborhoodsLayer ? [{ ...neighborhoodsLayer, type: 'neighborhoods' }] : []),
      ...(rasterLayers ? rasterLayers.map(l => ({ ...l, type: (l.type && ['raster', 'bitmask'].includes(l.type) ? l.type : 'raster') })) : []),
    ];
  }, [cellsLayer, moleculesLayer, neighborhoodsLayer, rasterLayers, obsSegmentationsType]);

  useEffect(() => {
    if ((typeof targetX !== 'number' || typeof targetY !== 'number')) {
      const {
        initialTargetX, initialTargetY, initialTargetZ, initialZoom,
      } = getInitialSpatialTargets({
        width,
        height,
        obsSegmentations,
        obsSegmentationsType,
        imageLayerLoaders,
        useRaster: Boolean(hasImageData),
        use3d,
      });
      setTargetX(initialTargetX);
      setTargetY(initialTargetY);
      setTargetZ(initialTargetZ);
      setZoom(initialZoom);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [imageLayerLoaders, targetX, targetY, setTargetX, setTargetY,
    setZoom, use3d, hasImageData, obsSegmentations, obsSegmentationsType]);

  const mergedCellSets = useMemo(() => mergeCellSets(
    cellSets, additionalCellSets,
  ), [cellSets, additionalCellSets]);

  const setCellSelectionProp = useCallback((v) => {
    setCellSelection(
      v, additionalCellSets, cellSetColor,
      setCellSetSelection, setAdditionalCellSets, setCellSetColor,
      setCellColorEncoding,
    );
  }, [additionalCellSets, cellSetColor, setCellColorEncoding,
    setAdditionalCellSets, setCellSetColor, setCellSetSelection]);

  const cellColors = useMemo(() => getCellColors({
    cellColorEncoding,
    expressionData: expressionData && expressionData[0],
    geneSelection,
    cellSets: mergedCellSets,
    cellSetSelection,
    cellSetColor,
    obsIndex,
    theme,
  }), [cellColorEncoding, geneSelection, mergedCellSets, theme,
    cellSetColor, cellSetSelection, expressionData, obsIndex]);

  // The bitmask layer needs access to a array (i.e a texture) lookup of cell -> expression value
  // where each cell id indexes into the array.
  // Cell ids in `attrs.rows` do not necessaryily correspond to indices in that array, though,
  // so we create a "shifted" array where this is the case.
  const shiftedExpressionDataForBitmask = useMemo(() => {
    const hasBitmask = imageLayerMeta.some(l => l?.metadata?.isBitmask);
    if (obsIndex && expressionData && hasBitmask) {
      const maxId = obsIndex.reduce((max, curr) => Math.max(max, Number(curr)));
      const result = new Uint8Array(maxId + 1);
      // eslint-disable-next-line no-plusplus
      for (let i = 0; i < obsIndex.length; i++) {
        const id = obsIndex[i];
        result.set(expressionData[0].slice(i, i + 1), Number(id));
      }
      return [result];
    } return [new Uint8Array()];
  }, [obsIndex, expressionData, imageLayerMeta]);

  const cellSelection = useMemo(() => Array.from(cellColors.keys()), [cellColors]);

  const getCellInfo = (cellId) => {
    const cell = obsIndex[cellId]; // TODO: use obsIndex
    if (cell) {
      return {
        [`${capitalize(observationsLabel)} ID`]: cellId,
        ...cell.factors, // TODO: no longer use factors
      };
    }
    return null;
  };

  const setViewState = ({
    zoom: newZoom,
    target,
    rotationX: newRotationX,
    rotationOrbit: newRotationOrbit,
    orbitAxis: newOrbitAxis,
  }) => {
    setZoom(newZoom);
    setTargetX(target[0]);
    setTargetY(target[1]);
    setTargetZ(target[2] || null);
    setRotationX(newRotationX);
    setRotationOrbit(newRotationOrbit);
    setOrbitAxis(newOrbitAxis || null);
  };

  const subtitle = makeSpatialSubtitle({
    observationsCount: obsIndex?.length,
    observationsLabel,
    observationsPluralLabel,
    subobservationsCount: moleculesCount,
    subobservationsLabel,
    subobservationsPluralLabel,
    locationsCount,
  });

  // Set up a getter function for gene expression values, to be used
  // by the DeckGL layer to obtain values for instanced attributes.
  const getExpressionValue = useExpressionValueGetter({ obsIndex, expressionData });
  const canLoad3DLayers = imageLayerLoaders.some(loader => Boolean(
    Array.from({
      length: loader.data.length,
    }).filter((_, res) => canLoadResolution(loader.data, res)).length,
  ));
  // Only show 3D options if we can theoretically load the data and it is allowed to be loaded.
  const canShow3DOptions = canLoad3DLayers
    && !(disable3d?.length === imageLayerLoaders.length) && !globalDisable3d;

  return (
    <TitleInfo
      title={title}
      info={subtitle}
      isSpatial
      urls={urls}
      theme={theme}
      removeGridComponent={removeGridComponent}
      isReady={isReady}
      options={
        // Only show button if there is expression or 3D data because only cells data
        // does not have any options (i.e for color encoding, you need to switch to expression data)
        canShow3DOptions || hasExpressionData ? (
          <SpatialOptions
            observationsLabel={observationsLabel}
            cellColorEncoding={cellColorEncoding}
            setCellColorEncoding={setCellColorEncoding}
            setSpatialAxisFixed={setSpatialAxisFixed}
            spatialAxisFixed={spatialAxisFixed}
            use3d={use3d}
            geneExpressionColormap={geneExpressionColormap}
            setGeneExpressionColormap={setGeneExpressionColormap}
            geneExpressionColormapRange={geneExpressionColormapRange}
            setGeneExpressionColormapRange={setGeneExpressionColormapRange}
            canShowExpressionOptions={hasExpressionData}
            canShowColorEncodingOption={hasCellsData && hasExpressionData}
            canShow3DOptions={canShow3DOptions}
          />
        ) : null
      }
    >
      <Spatial
        ref={deckRef}
        uuid={uuid}
        width={width}
        height={height}
        viewState={{
          zoom,
          target: [targetX, targetY, targetZ],
          rotationX,
          rotationY,
          rotationZ,
          rotationOrbit,
          orbitAxis,
        }}
        setViewState={setViewState}
        layers={layers}
        obsLocationsIndex={obsLocationsIndex} // TODO: use
        obsSegmentationsIndex={obsSegmentationsIndex}
        obsLocations={obsLocations} // TODO: use
        obsSegmentations={obsSegmentations}
        obsSegmentationsType={obsSegmentationsType}
        cellFilter={cellFilter}
        cellSelection={cellSelection}
        cellHighlight={cellHighlight}
        cellColors={cellColors}
        molecules={molecules}
        neighborhoods={neighborhoods}
        imageLayerLoaders={imageLayerLoaders}
        setCellFilter={setCellFilter}
        setCellSelection={setCellSelectionProp}
        setCellHighlight={setCellHighlight}
        setMoleculeHighlight={setMoleculeHighlight}
        setComponentHover={() => {
          setComponentHover(uuid);
        }}
        updateViewInfo={setComponentViewInfo}
        rasterLayersCallbacks={rasterLayersCallbacks}
        spatialAxisFixed={spatialAxisFixed}
        geneExpressionColormap={geneExpressionColormap}
        geneExpressionColormapRange={geneExpressionColormapRange}
        expressionData={shiftedExpressionDataForBitmask}
        cellColorEncoding={cellColorEncoding}
        getExpressionValue={getExpressionValue}
        theme={theme}
      />
      {!disableTooltip && (
        <SpatialTooltipSubscriber
          parentUuid={uuid}
          cellHighlight={cellHighlight}
          width={width}
          height={height}
          getCellInfo={getCellInfo}
        />
      )}
    </TitleInfo>
  );
}
