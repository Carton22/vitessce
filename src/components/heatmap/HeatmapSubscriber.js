import React, {
  useEffect, useState, useCallback, useMemo,
} from 'react';
import TitleInfo from '../TitleInfo';
import { pluralize, capitalize } from '../../utils';
import { useDeckCanvasSize, useGetObsInfo, useReady, useUrls } from '../hooks';
import { mergeCellSets } from '../utils';
import {
  useObsSetsData,
  useObsFeatureMatrixData,
  useMultiObsLabels,
} from '../data-hooks';
import { getCellColors } from '../interpolate-colors';
import {
  useCoordination, useLoaders,
  useSetComponentHover, useSetComponentViewInfo,
} from '../../app/state/hooks';
import {
  COMPONENT_COORDINATION_TYPES,
} from '../../app/state/coordination';
import Heatmap from './Heatmap';
import HeatmapTooltipSubscriber from './HeatmapTooltipSubscriber';
import HeatmapOptions from './HeatmapOptions';
import { DataType } from '../../app/constants';

const HEATMAP_DATA_TYPES = [DataType.OBS_SETS, DataType.OBS_FEATURE_MATRIX];

/**
 * @param {object} props
 * @param {number} props.uuid The unique identifier for this component.
 * @param {object} props.coordinationScopes The mapping from coordination types to coordination
 * scopes.
 * @param {function} props.removeGridComponent The callback function to pass to TitleInfo,
 * to call when the component has been removed from the grid.
 * @param {string} props.title The component title.
 * @param {boolean} props.transpose Whether to
 * render as cell-by-gene or gene-by-cell.
 * @param {string} props.observationsLabelOverride The singular
 * form of the name of the observation.
 * @param {string} props.observationsPluralLabelOverride The
 * plural form of the name of the observation.
 * @param {string} props.variablesLabelOverride The singular
 * form of the name of the variable.
 * @param {string} props.variablesPluralLabelOverride The plural
 * form of the name of the variable.
 * @param {boolean} props.disableTooltip Whether to disable the
 * tooltip on mouse hover.
 */
export default function HeatmapSubscriber(props) {
  const {
    uuid,
    coordinationScopes,
    removeGridComponent, theme, transpose,
    observationsLabelOverride: observationsLabel = 'cell',
    observationsPluralLabelOverride: observationsPluralLabel = `${observationsLabel}s`,
    variablesLabelOverride: variablesLabel = 'gene',
    variablesPluralLabelOverride: variablesPluralLabel = `${variablesLabel}s`,
    disableTooltip = false,
    title = 'Heatmap',
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
    heatmapZoomX: zoomX,
    heatmapTargetX: targetX,
    heatmapTargetY: targetY,
    featureSelection: geneSelection,
    obsHighlight: cellHighlight,
    featureHighlight: geneHighlight,
    obsSetSelection: cellSetSelection,
    obsSetColor: cellSetColor,
    additionalObsSets: additionalCellSets,
    featureValueColormap: geneExpressionColormap,
    featureValueColormapRange: geneExpressionColormapRange,
  }, {
    setHeatmapZoomX: setZoomX,
    setHeatmapZoomY: setZoomY,
    setHeatmapTargetX: setTargetX,
    setHeatmapTargetY: setTargetY,
    setObsHighlight: setCellHighlight,
    setFeatureHighlight: setGeneHighlight,
    setObsSetSelection: setCellSetSelection,
    setObsSetColor: setCellSetColor,
    setFeatureValueColormapRange: setGeneExpressionColormapRange,
    setFeatureValueColormap: setGeneExpressionColormap,
  }] = useCoordination(COMPONENT_COORDINATION_TYPES.heatmap, coordinationScopes);

  const observationsTitle = capitalize(observationsPluralLabel);
  const variablesTitle = capitalize(variablesPluralLabel);

  const [isRendering, setIsRendering] = useState(false);
  const [
    isReady,
    setItemIsReady,
    setItemIsNotReady, // eslint-disable-line no-unused-vars
    resetReadyItems,
  ] = useReady(
    HEATMAP_DATA_TYPES,
  );
  const [urls, addUrl, resetUrls] = useUrls();
  const [width, height, deckRef] = useDeckCanvasSize();

  // Reset file URLs and loader progress when the dataset has changed.
  useEffect(() => {
    resetUrls();
    resetReadyItems();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loaders, dataset]);

  const [obsLabelsTypes, obsLabelsData] = useMultiObsLabels(
    coordinationScopes, obsType, loaders, dataset, setItemIsReady, addUrl,
  );

  // Get data from loaders using the data hooks.
  const { obsIndex, featureIndex, obsFeatureMatrix } = useObsFeatureMatrixData(
    loaders, dataset, setItemIsReady, addUrl, true, {}, {},
    { obsType, featureType, featureValueType },
  );
  const { obsSets: cellSets } = useObsSetsData(
    loaders, dataset, setItemIsReady, addUrl, false,
    { setObsSetSelection: setCellSetSelection, setObsSetColor: setCellSetColor },
    { obsSetSelection: cellSetSelection, obsSetColor: cellSetColor },
    { obsType },
  );
  const mergedCellSets = useMemo(() => mergeCellSets(
    cellSets, additionalCellSets,
  ), [cellSets, additionalCellSets]);

  const cellColors = useMemo(() => getCellColors({
    // Only show cell set selection on heatmap labels.
    cellColorEncoding: 'cellSetSelection',
    geneSelection,
    cellSets: mergedCellSets,
    cellSetSelection,
    cellSetColor,
    obsIndex,
    theme,
  }), [mergedCellSets, geneSelection, theme,
    cellSetColor, cellSetSelection, obsIndex]);

  const getCellInfo = useGetObsInfo(
    observationsLabel, obsIndex, obsLabelsTypes, obsLabelsData,
  );

  const getGeneInfo = useCallback((geneId) => {
    if (geneId) {
      return { [`${capitalize(variablesLabel)} ID`]: geneId };
    }
    return null;
  }, [variablesLabel]);

  const expressionMatrix = useMemo(() => {
    if (obsIndex && featureIndex && obsFeatureMatrix) {
      return {
        rows: obsIndex,
        cols: featureIndex,
        matrix: obsFeatureMatrix.data,
      };
    }
    return null;
  }, [obsIndex, featureIndex, obsFeatureMatrix]);

  const cellsCount = obsIndex ? obsIndex.length : 0;
  const genesCount = featureIndex ? featureIndex.length : 0;

  const setTrackHighlight = useCallback(() => {
    // No-op, since the default handler
    // logs in the console on every hover event.
  }, []);

  const cellColorLabels = useMemo(() => ([
    `${capitalize(observationsLabel)} Set`,
  ]), [observationsLabel]);

  const selectedCount = cellColors.size;
  return (
    <TitleInfo
      title={title}
      info={`${cellsCount} ${pluralize(observationsLabel, observationsPluralLabel, cellsCount)} × ${genesCount} ${pluralize(variablesLabel, variablesPluralLabel, genesCount)},
             with ${selectedCount} ${pluralize(observationsLabel, observationsPluralLabel, selectedCount)} selected`}
      urls={urls}
      theme={theme}
      removeGridComponent={removeGridComponent}
      isReady={isReady && !isRendering}
      options={(
        <HeatmapOptions
          geneExpressionColormap={geneExpressionColormap}
          setGeneExpressionColormap={setGeneExpressionColormap}
          geneExpressionColormapRange={geneExpressionColormapRange}
          setGeneExpressionColormapRange={setGeneExpressionColormapRange}
        />
      )}
    >
      <Heatmap
        ref={deckRef}
        transpose={transpose}
        viewState={{ zoom: zoomX, target: [targetX, targetY] }}
        setViewState={({ zoom, target }) => {
          setZoomX(zoom);
          setZoomY(zoom);
          setTargetX(target[0]);
          setTargetY(target[1]);
        }}
        colormapRange={geneExpressionColormapRange}
        setColormapRange={setGeneExpressionColormapRange}
        height={height}
        width={width}
        theme={theme}
        uuid={uuid}
        expressionMatrix={expressionMatrix}
        cellColors={cellColors}
        colormap={geneExpressionColormap}
        setIsRendering={setIsRendering}
        setCellHighlight={setCellHighlight}
        setGeneHighlight={setGeneHighlight}
        setTrackHighlight={setTrackHighlight}
        setComponentHover={() => {
          setComponentHover(uuid);
        }}
        updateViewInfo={setComponentViewInfo}
        observationsTitle={observationsTitle}
        variablesTitle={variablesTitle}
        variablesDashes={false}
        observationsDashes={false}
        cellColorLabels={cellColorLabels}
        useDevicePixels
      />
      {!disableTooltip && (
      <HeatmapTooltipSubscriber
        parentUuid={uuid}
        width={width}
        height={height}
        transpose={transpose}
        getCellInfo={getCellInfo}
        getGeneInfo={getGeneInfo}
        cellHighlight={cellHighlight}
        geneHighlight={geneHighlight}
      />
      )}
    </TitleInfo>
  );
}
