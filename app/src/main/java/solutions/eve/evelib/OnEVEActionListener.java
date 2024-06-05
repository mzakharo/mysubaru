package solutions.eve.evelib;

import solutions.eve.evelib.helper.json.EVEResponse;

/* loaded from: classes.dex */
public interface OnEVEActionListener {
    void onEVEActionComplete(EVEResponse eVEResponse, Object obj);

    void onEVEActionError(EVEResponse eVEResponse, Object obj);
}
