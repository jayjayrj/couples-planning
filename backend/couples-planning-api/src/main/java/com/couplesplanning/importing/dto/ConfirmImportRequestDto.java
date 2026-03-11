package com.couplesplanning.importing.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;

import java.util.ArrayList;
import java.util.List;

public class ConfirmImportRequestDto {

    private String importId;

    @NotNull
    private Long targetAccountId;

    @NotNull
    private Long targetHouseholdId;

    @Valid
    @NotEmpty
    private List<ConfirmImportedItemDto> selectedItems = new ArrayList<>();

    public ConfirmImportRequestDto() {
    }

    public String getImportId() {
        return importId;
    }

    public void setImportId(String importId) {
        this.importId = importId;
    }

    public Long getTargetAccountId() {
        return targetAccountId;
    }

    public void setTargetAccountId(Long targetAccountId) {
        this.targetAccountId = targetAccountId;
    }

    public Long getTargetHouseholdId() {
        return targetHouseholdId;
    }

    public void setTargetHouseholdId(Long targetHouseholdId) {
        this.targetHouseholdId = targetHouseholdId;
    }

    public List<ConfirmImportedItemDto> getSelectedItems() {
        return selectedItems;
    }

    public void setSelectedItems(List<ConfirmImportedItemDto> selectedItems) {
        this.selectedItems = selectedItems;
    }
}