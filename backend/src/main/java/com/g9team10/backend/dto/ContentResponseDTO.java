public record ContentResponseDTO(
        String category,
        Double probability,
        List<String> additionalInformation,
        String level
){}