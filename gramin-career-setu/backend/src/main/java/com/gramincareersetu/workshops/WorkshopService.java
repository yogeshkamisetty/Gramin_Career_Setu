package com.gramincareersetu.workshops;

import com.gramincareersetu.common.BadRequestException;
import com.gramincareersetu.common.ResourceNotFoundException;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class WorkshopService {

    private static final Logger log = LoggerFactory.getLogger(WorkshopService.class);

    private final WorkshopRepository workshopRepository;
    private final WorkshopRegistrationRepository registrationRepository;

    @Autowired
    public WorkshopService(
            WorkshopRepository workshopRepository,
            WorkshopRegistrationRepository registrationRepository
    ) {
        this.workshopRepository = workshopRepository;
        this.registrationRepository = registrationRepository;
    }

    @Transactional(readOnly = true)
    @Cacheable(value = "workshops", unless = "#result == null || #result.isEmpty()")
    public List<WorkshopDto> getUpcomingWorkshops() {
        return workshopRepository.findByStatusOrderByEventDateAsc("UPCOMING")
                .stream()
                .map(WorkshopDto::fromEntity)
                .toList();
    }

    @Transactional
    public WorkshopRegistrationEntity registerForWorkshop(String workshopId, RegisterWorkshopRequest request, UUID userId) {
        String phone = request.phone().trim();
        String name = request.name().trim();

        // 1. Scoped idempotency check
        if (request.idempotencyKey() != null && !request.idempotencyKey().isBlank()) {
            Optional<WorkshopRegistrationEntity> existing = registrationRepository
                    .findByWorkshopIdAndIdempotencyKey(workshopId, request.idempotencyKey());
            if (existing.isPresent()) {
                WorkshopRegistrationEntity reg = existing.get();
                if (reg.getPhone().equals(phone)) {
                    log.info("Idempotent registration replay for workshop {} key {}", workshopId, request.idempotencyKey());
                    return reg;
                } else {
                    throw new BadRequestException("Idempotency key has already been used with different registration details");
                }
            }
        }

        // 2. Lock the workshop row with PESSIMISTIC_WRITE to prevent concurrent overbooking
        WorkshopEntity workshop = workshopRepository.findByIdForUpdate(workshopId)
                .orElseThrow(() -> new ResourceNotFoundException("Workshop", "id", workshopId));

        if (!"UPCOMING".equalsIgnoreCase(workshop.getStatus())) {
            throw new BadRequestException("Registrations are closed for this workshop");
        }

        // 3. Atomically check capacity under pessimistic lock
        long currentCount = registrationRepository.countByWorkshopId(workshopId);
        if (currentCount >= workshop.getCapacity()) {
            throw new BadRequestException("Workshop has reached its maximum capacity of " + workshop.getCapacity());
        }

        // 4. Check duplicate phone
        if (registrationRepository.existsByWorkshopIdAndPhone(workshopId, phone)) {
            throw new BadRequestException("Phone number is already registered for this workshop");
        }

        String idempotencyKey = (request.idempotencyKey() != null && !request.idempotencyKey().isBlank())
                ? request.idempotencyKey()
                : UUID.randomUUID().toString();

        WorkshopRegistrationEntity registration = new WorkshopRegistrationEntity(
                workshop.getId(),
                userId,
                name,
                phone,
                idempotencyKey
        );

        WorkshopRegistrationEntity saved = registrationRepository.save(registration);
        log.info("Successfully registered user {} for workshop {}", saved.getName(), workshopId);
        return saved;
    }

    @Transactional
    public void cancelRegistration(String workshopId, String phone) {
        if (phone == null || phone.isBlank()) {
            throw new BadRequestException("Phone number is required to cancel registration");
        }
        Optional<WorkshopRegistrationEntity> existing = registrationRepository.findByWorkshopIdAndPhone(workshopId, phone.trim());
        if (existing.isEmpty()) {
            throw new ResourceNotFoundException("Registration not found for the provided phone and workshop");
        }
        registrationRepository.deleteByWorkshopIdAndPhone(workshopId, phone.trim());
        log.info("Cancelled registration for phone {} on workshop {}", phone, workshopId);
    }
}
