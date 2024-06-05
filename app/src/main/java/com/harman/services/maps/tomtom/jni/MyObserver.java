package com.harman.services.maps.tomtom.jni;

import com.harman.services.Log;
import com.harman.services.maps.tomtom.BuildingBlock;
import com.harman.services.maps.tomtom.IFetchObserver;
import com.harman.services.maps.tomtom.IUpdateObserver;
import com.harman.services.maps.tomtom.IValidationObserver;
import com.harman.services.maps.tomtom.UpdateRegion;

/* loaded from: classes.dex */
public class MyObserver implements IFetchObserver, IUpdateObserver, IValidationObserver {
    private static final String TAG = "com.harman.services.maps.tomtom.jni.MyObserver";
    int m_lastFetchProgress = -1;
    int m_lastUpdateProgress = -1;
    int m_lastValidationProgress = -1;

    @Override // com.harman.services.maps.tomtom.IUpdateObserver
    public void onUpdateRegionFinished(UpdateRegion updateRegion) {
    }

    @Override // com.harman.services.maps.tomtom.IFetchObserver
    public void onFetchProgress(int i) {
        Log.i(TAG, "onFetchProgress: " + i + " %");
        if (this.m_lastFetchProgress != i) {
            this.m_lastFetchProgress = i;
            if (i == 0 || i == 100) {
                Native.getInstance().notifyDownloadProgress(DownloadManager.getInstance().getDeviceCode(), DownloadManager.getInstance().getProductCode(), DownloadManager.getInstance().getProductId(), DownloadManager.getInstance().getSupplierId(), DownloadManager.getInstance().getBaselineId(), DownloadManager.getInstance().getRegionId(), DownloadManager.getInstance().getFromVersion(), DownloadManager.getInstance().getToVersion(), i, 0, DownloadManager.getInstance().getModel());
            }
        }
    }

    @Override // com.harman.services.maps.tomtom.IUpdateObserver
    public void onUpdateProgress(int i) {
        if (this.m_lastUpdateProgress != i) {
            this.m_lastUpdateProgress = i;
            Log.i(TAG, "Update Progress::" + i + " %");
        }
    }

    @Override // com.harman.services.maps.tomtom.IValidationObserver
    public void onValidationProgress(int i) {
        if (this.m_lastValidationProgress != i) {
            this.m_lastValidationProgress = i;
            Log.i(TAG, "Validation Progress::" + i + " %");
        }
    }

    @Override // com.harman.services.maps.tomtom.IUpdateObserver
    public void onUpdateRegionStarted(UpdateRegion updateRegion, int i, int i2) {
        String str = TAG;
        Log.i(str, " Started Update Region " + updateRegion.getId());
        Log.i(str, " update from version " + i);
        Log.i(str, " to " + i2);
    }

    @Override // com.harman.services.maps.tomtom.IUpdateObserver
    public void onUpdateRegionFinished(UpdateRegion updateRegion, int i, int i2) {
        String str = TAG;
        Log.i(str, " Finished Update Region " + updateRegion.getId());
        Log.i(str, " update from version " + i);
        Log.i(str, " to " + i2);
    }

    @Override // com.harman.services.maps.tomtom.IUpdateObserver
    public void onBuildingBlockStarted(BuildingBlock buildingBlock, int i, int i2) {
        String str = TAG;
        Log.i(str, " Started Building Block " + buildingBlock.getId());
        Log.i(str, " update from version " + i);
        Log.i(str, " to " + i2);
    }

    @Override // com.harman.services.maps.tomtom.IUpdateObserver
    public void onBuildingBlockFinished(BuildingBlock buildingBlock, int i, int i2) {
        String str = TAG;
        Log.i(str, " Finished Building Block " + buildingBlock.getId());
        Log.i(str, " update from version " + i);
        Log.i(str, " to " + i2);
    }
}
